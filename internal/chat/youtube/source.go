package youtube

import (
	"context"

	"skibidi-peek/internal/chat"
)

// LiveChatSource represents a backend source for streaming live YouTube chat messages.
// This interface allows substituting the default Innertube HTTP poller with alternative
// implementations (such as YouTube Data API v3 liveChatMessages, or a headless/webview
// popout chat) should Innertube change or break.
type LiveChatSource interface {
	// Connect initiates connection to the YouTube live chat for the given resolved target URL or ID.
	Connect(ctx context.Context, target string) error

	// Messages returns a read-only channel of parsed ChatMessage items.
	Messages() <-chan chat.ChatMessage

	// Deletions returns a read-only channel of deleted message IDs.
	Deletions() <-chan string

	// Errors returns a read-only channel of errors encountered during polling or streaming.
	Errors() <-chan error

	// Close terminates the source connection and releases resources.
	Close() error
}

