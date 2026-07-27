package store

import (
	"errors"
	"sync"
	"time"
)

var ErrNotFound = errors.New("not found")

type Link struct {
	Code      string    `json:"code"`
	Dest      string    `json:"dest"`
	Hits      int64     `json:"hits"`
	CreatedAt time.Time `json:"createdAt"`
}

type Store interface {
	PutLink(code, dest string) (Link, error)
	GetLink(code string) (Link, error)
	HitLink(code string) (Link, error)
}

type Memory struct {
	mu    sync.RWMutex
	links map[string]*Link
}

func NewMemory() *Memory {
	return &Memory{links: make(map[string]*Link)}
}

func (m *Memory) PutLink(code, dest string) (Link, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if _, ok := m.links[code]; ok {
		return Link{}, errors.New("code exists")
	}
	l := &Link{Code: code, Dest: dest, CreatedAt: time.Now().UTC()}
	m.links[code] = l
	return *l, nil
}

func (m *Memory) GetLink(code string) (Link, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	l, ok := m.links[code]
	if !ok {
		return Link{}, ErrNotFound
	}
	return *l, nil
}

func (m *Memory) HitLink(code string) (Link, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	l, ok := m.links[code]
	if !ok {
		return Link{}, ErrNotFound
	}
	l.Hits++
	return *l, nil
}
