package youtube

import (
	"errors"
	"testing"
)

func TestParseLivePage(t *testing.T) {
	tests := []struct {
		name    string
		html    string
		want    string
		wantErr error
		anyErr  bool
	}{
		{
			name: "live canonical",
			html: `<html><head><link rel="canonical" href="https://www.youtube.com/watch?v=0sfDth4lMLc"></head></html>`,
			want: "https://www.youtube.com/watch?v=0sfDth4lMLc",
		},
		{
			name:    "offline canonical",
			html:    `<html><head><link rel="canonical" href="https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA"></head><script>{"videoId":"aaaaaaaaaaa"}</script></html>`,
			wantErr: ErrChannelOffline,
		},
		{
			name:   "no canonical",
			html:   `<html><script>{"videoId":"aaaaaaaaaaa"}</script></html>`,
			anyErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := parseLivePage(tt.html)
			if tt.anyErr {
				if err == nil || errors.Is(err, ErrChannelOffline) {
					t.Fatalf("err = %v, want non-offline error", err)
				}

				return
			}

			if !errors.Is(err, tt.wantErr) {
				t.Fatalf("err = %v, want %v", err, tt.wantErr)
			}

			if got != tt.want {
				t.Errorf("got %q, want %q", got, tt.want)
			}
		})
	}
}

func TestResolveInputKinds(t *testing.T) {
	channelInputs := []string{
		"@MrBeast",
		"UCX6OQ3DkcsbYNE6H8uQQuVA",
		"https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA",
		"youtube.com/@x/live",
		"https://www.youtube.com/@LofiGirl",
		"https://m.youtube.com/@LofiGirl/live",
	}

	for _, in := range channelInputs {
		r, err := resolveInput(in)
		if err != nil || !r.isChannel() {
			t.Errorf("%q: got %+v, %v; want channel", in, r, err)
		}
	}

	videoTests := []struct {
		input string
		want  string
	}{
		{"0sfDth4lMLc", "https://www.youtube.com/watch?v=0sfDth4lMLc"},
		{"dQw4w9WgXcQ", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
		{"https://www.youtube.com/watch?v=0sfDth4lMLc", "https://www.youtube.com/watch?v=0sfDth4lMLc"},
		{"https://youtu.be/0sfDth4lMLc", "https://www.youtube.com/watch?v=0sfDth4lMLc"},
		{"https://www.youtube.com/live/0sfDth4lMLc", "https://www.youtube.com/watch?v=0sfDth4lMLc"},
		{"https://youtube.com/live/0sfDth4lMLc?feature=share", "https://www.youtube.com/watch?v=0sfDth4lMLc"},
		{"https://www.youtube.com/live_chat?v=0sfDth4lMLc", "https://www.youtube.com/watch?v=0sfDth4lMLc"},
		{"https://www.youtube.com/live_chat_replay?v=0sfDth4lMLc", "https://www.youtube.com/watch?v=0sfDth4lMLc"},
		{"https://m.youtube.com/watch?v=0sfDth4lMLc", "https://www.youtube.com/watch?v=0sfDth4lMLc"},
		{"https://music.youtube.com/watch?v=0sfDth4lMLc", "https://www.youtube.com/watch?v=0sfDth4lMLc"},
		{"https://www.youtube.com/shorts/0sfDth4lMLc", "https://www.youtube.com/watch?v=0sfDth4lMLc"},
		{"https://www.youtube.com/embed/0sfDth4lMLc", "https://www.youtube.com/watch?v=0sfDth4lMLc"},
	}

	for _, tt := range videoTests {
		r, err := resolveInput(tt.input)
		if err != nil {
			t.Errorf("%q: unexpected error: %v", tt.input, err)
			continue
		}

		if r.isChannel() {
			t.Errorf("%q: got channel, want video URL", tt.input)
			continue
		}

		if r.videoURL != tt.want {
			t.Errorf("%q: got %q, want %q", tt.input, r.videoURL, tt.want)
		}
	}
}
