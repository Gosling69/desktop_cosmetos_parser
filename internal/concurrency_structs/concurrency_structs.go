package concurrency_structs

import (
	"sync"
	"time"
)

type ConcList[T any] struct {
	mx sync.Mutex
	v  []T
}

func CreateList[T any]() *ConcList[T] {
	list := []T{}
	return &ConcList[T]{
		v: list,
	}
}
func (l *ConcList[T]) Append(vals ...T) {
	l.mx.Lock()
	defer l.mx.Unlock()
	l.v = append(l.v, vals...)

}
func (l *ConcList[T]) GetValue() []T {
	l.mx.Lock()
	defer l.mx.Unlock()
	return l.v
}
func (l *ConcList[T]) Length() int {
	l.mx.Lock()
	defer l.mx.Unlock()
	return len(l.v)
}

type Semaphore interface {
	Acquire()
	Release(instaRelease bool)
}
type semaphore struct {
	semC             chan struct{}
	seconds_to_sleep int
}

func CreateSemaphore(maxConcurrency, seconds int) Semaphore {
	return &semaphore{
		semC:             make(chan struct{}, maxConcurrency),
		seconds_to_sleep: seconds,
	}
}
func (s *semaphore) Acquire() {
	s.semC <- struct{}{}
}
func (s *semaphore) Release(instaRelease bool) {
	if !instaRelease {
		time.Sleep(time.Second * time.Duration(s.seconds_to_sleep))
	}
	<-s.semC
}
