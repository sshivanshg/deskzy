package config

import "os"

type Config struct {
	Addr       string
	PublicBase string
	CORSOrigin string
}

func Load() Config {
	addr := env("DESKZY_API_ADDR", ":8080")
	return Config{
		Addr:       addr,
		PublicBase: env("DESKZY_PUBLIC_BASE", "http://localhost:8080"),
		CORSOrigin: env("DESKZY_CORS_ORIGIN", "http://localhost:3000"),
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
