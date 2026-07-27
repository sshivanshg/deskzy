package httpapi

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/deskzy-xyz/deskzy/services/api/internal/config"
	"github.com/deskzy-xyz/deskzy/services/api/internal/links"
	"github.com/deskzy-xyz/deskzy/services/api/internal/store"
)

type Server struct {
	cfg   config.Config
	store store.Store
}

func New(cfg config.Config, st store.Store) *Server {
	return &Server{cfg: cfg, store: st}
}

func (s *Server) Router() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(15 * time.Second))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{s.cfg.CORSOrigin, "http://127.0.0.1:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok", "service": "deskzy-api"})
	})

	r.Route("/v1", func(r chi.Router) {
		r.Post("/links", s.createLink)
		r.Get("/links/{code}", s.getLink)
	})

	r.Get("/r/{code}", s.redirect)
	r.Get("/{code}", s.redirect)

	return r
}

type createLinkRequest struct {
	URL string `json:"url"`
}

func (s *Server) createLink(w http.ResponseWriter, r *http.Request) {
	var req createLinkRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid json")
		return
	}
	dest, err := links.NormalizeURL(req.URL)
	if err != nil {
		writeErr(w, http.StatusBadRequest, err.Error())
		return
	}

	var link store.Link
	for i := 0; i < 5; i++ {
		code, err := links.RandomCode(7)
		if err != nil {
			writeErr(w, http.StatusInternalServerError, "code generation failed")
			return
		}
		link, err = s.store.PutLink(code, dest)
		if err == nil {
			writeJSON(w, http.StatusCreated, map[string]any{
				"code":      link.Code,
				"dest":      link.Dest,
				"shortUrl":  stringsTrimSlash(s.cfg.PublicBase) + "/r/" + link.Code,
				"createdAt": link.CreatedAt,
			})
			return
		}
	}
	writeErr(w, http.StatusConflict, "could not allocate code")
}

func (s *Server) getLink(w http.ResponseWriter, r *http.Request) {
	code := chi.URLParam(r, "code")
	link, err := s.store.GetLink(code)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeErr(w, http.StatusNotFound, "not found")
			return
		}
		writeErr(w, http.StatusInternalServerError, "store error")
		return
	}
	writeJSON(w, http.StatusOK, link)
}

func (s *Server) redirect(w http.ResponseWriter, r *http.Request) {
	code := chi.URLParam(r, "code")
	if code == "" || code == "healthz" || code == "v1" || code == "r" {
		http.NotFound(w, r)
		return
	}
	link, err := s.store.HitLink(code)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			http.NotFound(w, r)
			return
		}
		writeErr(w, http.StatusInternalServerError, "store error")
		return
	}
	http.Redirect(w, r, link.Dest, http.StatusFound)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeErr(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

func stringsTrimSlash(s string) string {
	for len(s) > 0 && s[len(s)-1] == '/' {
		s = s[:len(s)-1]
	}
	return s
}
