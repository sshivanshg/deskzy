package main

import (
	"log"
	"net/http"
	"os"

	"github.com/deskzy-xyz/deskzy/services/api/internal/config"
	"github.com/deskzy-xyz/deskzy/services/api/internal/httpapi"
	"github.com/deskzy-xyz/deskzy/services/api/internal/store"
)

func main() {
	cfg := config.Load()
	mem := store.NewMemory()
	srv := httpapi.New(cfg, mem)

	addr := cfg.Addr
	log.Printf("deskzy-api listening on %s", addr)
	if err := http.ListenAndServe(addr, srv.Router()); err != nil {
		log.Println(err)
		os.Exit(1)
	}
}
