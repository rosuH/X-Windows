"use client";

import { CodeBlock } from "@/components/code-block";
import type { ThemeComponentProps } from "@/themes/types";
import type { ThemeDefinition } from "@/themes/types";
import { SwiftIcon } from "@/lib/icons";

const SWIFTUI_CODE = `import SwiftUI

struct TweetDetailView: View {
    @State private var viewModel = TweetDetailViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            VStack(spacing: 0) {
                TopBar(title: Localized.tweetTitle, onBack: { dismiss() })
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        AuthorRow(profile: viewModel.profile)
                        TweetBody(paragraphs: viewModel.body)
                        if let attachment = viewModel.attachment {
                            LinkPreview(attachment: attachment)
                        }
                        if let quoted = viewModel.quotedTweet {
                            QuotedPost(tweet: quoted)
                        }
                        Divider()
                            .background(Color.white.opacity(0.1))
                        MetaSection(stats: viewModel.stats)
                        ActionToolbar(stats: viewModel.stats)
                        ReplyComposerBar(profile: viewModel.currentUserProfile)
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 16)
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}

struct TopBar: View {
    let title: LocalizedStringKey
    let onBack: () -> Void
    
    var body: some View {
        HStack {
            Button(action: onBack) {
                Image(systemName: "arrow.left")
                    .foregroundColor(.white)
                    .font(.system(size: 18, weight: .medium))
            }
            Spacer()
            Text(title)
                .foregroundColor(.white)
                .font(.system(size: 18, weight: .semibold))
            Spacer()
            Button(action: {}) {
                Image(systemName: "ellipsis")
                    .foregroundColor(.white)
                    .font(.system(size: 18, weight: .medium))
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.black)
    }
}

struct AuthorRow: View {
    let profile: TweetProfile
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            AsyncImage(url: profile.avatarURL) { image in
                image.resizable()
            } placeholder: {
                Circle()
                    .fill(Color.gray.opacity(0.3))
            }
            .frame(width: 48, height: 48)
            .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(profile.displayName)
                        .foregroundColor(.white)
                        .font(.system(size: 16, weight: .bold))
                    if profile.isVerified {
                        Image(systemName: "checkmark.seal.fill")
                            .foregroundColor(.blue)
                            .font(.system(size: 16))
                    }
                    if profile.isPremium {
                        Image(systemName: "square.stack.3d.up.fill")
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [.purple, .pink, .orange],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .font(.system(size: 14))
                    }
                    Spacer()
                    Text(profile.source)
                        .foregroundColor(.gray)
                        .font(.system(size: 14))
                }
                HStack(spacing: 8) {
                    Text(profile.handle)
                        .foregroundColor(.gray)
                        .font(.system(size: 15))
                    Text("•")
                        .foregroundColor(.gray)
                        .font(.system(size: 14))
                    Text(profile.timestamp)
                        .foregroundColor(.gray)
                        .font(.system(size: 15))
                }
            }
        }
    }
}

struct TweetBody: View {
    let paragraphs: [LocalizedStringKey]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ForEach(Array(paragraphs.enumerated()), id: \.offset) { _, paragraph in
                Text(paragraph)
                    .foregroundColor(.white)
                    .font(.system(size: 17, weight: .regular))
                    .lineSpacing(4)
            }
            HStack(spacing: 8) {
                Text("🚀")
                    .font(.system(size: 20))
                Text("👇")
                    .font(.system(size: 20))
                Spacer()
                Button(action: {}) {
                    Text(Localized.showTranslation)
                        .foregroundColor(.blue)
                        .font(.system(size: 15))
                }
            }
            .padding(.top, 8)
        }
    }
}

struct LinkPreview: View {
    let attachment: LinkAttachment
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top, spacing: 12) {
                VStack(alignment: .leading, spacing: 8) {
                    Text(attachment.title)
                        .foregroundColor(.white)
                        .font(.system(size: 16, weight: .semibold))
                        .lineLimit(2)
                    Text(attachment.subtitle)
                        .foregroundColor(.gray)
                        .font(.system(size: 14))
                        .lineLimit(2)
                    HStack(spacing: 4) {
                        Image(systemName: "link")
                            .foregroundColor(.gray)
                            .font(.system(size: 12))
                        Text(attachment.host)
                            .foregroundColor(.gray)
                            .font(.system(size: 13))
                    }
                }
                Spacer()
                if let logoURL = attachment.logoURL {
                    AsyncImage(url: logoURL) { image in
                        image.resizable()
                    } placeholder: {
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color.gray.opacity(0.2))
                    }
                    .frame(width: 64, height: 64)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }
            .padding(16)
        }
        .background(Color.white.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.1), lineWidth: 1)
        )
    }
}

struct QuotedPost: View {
    let tweet: QuotedTweet
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top, spacing: 12) {
                AsyncImage(url: tweet.authorAvatarURL) { image in
                    image.resizable()
                } placeholder: {
                    Circle()
                        .fill(Color.gray.opacity(0.3))
                }
                .frame(width: 36, height: 36)
                .clipShape(Circle())
                
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 6) {
                        Text(tweet.authorName)
                            .foregroundColor(.white)
                            .font(.system(size: 15, weight: .semibold))
                        if tweet.isVerified {
                            Image(systemName: "checkmark.seal.fill")
                                .foregroundColor(.blue)
                                .font(.system(size: 14))
                        }
                        Text(tweet.authorHandle)
                            .foregroundColor(.gray)
                            .font(.system(size: 14))
                        Text("•")
                            .foregroundColor(.gray)
                            .font(.system(size: 13))
                        Text(tweet.timestamp)
                            .foregroundColor(.gray)
                            .font(.system(size: 14))
                    }
                    Text(tweet.body)
                        .foregroundColor(.white)
                        .font(.system(size: 15))
                        .lineLimit(3)
                        .lineSpacing(2)
                    if tweet.hasMore {
                        Text(Localized.whatsNew)
                            .foregroundColor(.gray)
                            .font(.system(size: 14))
                            .padding(.top, 4)
                    }
                }
            }
            .padding(16)
        }
        .background(Color.white.opacity(0.03))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.08), lineWidth: 1)
        )
    }
}

struct MetaSection: View {
    let stats: TweetStats
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 8) {
                Text(stats.timestamp)
                    .foregroundColor(.gray)
                    .font(.system(size: 14))
                Text("•")
                    .foregroundColor(.gray)
                    .font(.system(size: 13))
                Text(stats.date)
                    .foregroundColor(.gray)
                    .font(.system(size: 14))
                Text("•")
                    .foregroundColor(.gray)
                    .font(.system(size: 13))
                HStack(spacing: 4) {
                    Image(systemName: "eye")
                        .foregroundColor(.gray)
                        .font(.system(size: 12))
                    Text(stats.views)
                        .foregroundColor(.gray)
                        .font(.system(size: 14))
                }
            }
        }
    }
}

struct ActionToolbar: View {
    let stats: TweetStats
    
    var body: some View {
        HStack(spacing: 0) {
            ActionButton(
                icon: "message",
                count: stats.comments,
                color: .gray
            )
            Spacer()
            ActionButton(
                icon: "arrow.2.squarepath",
                count: stats.reposts + stats.quotes,
                color: .gray
            )
            Spacer()
            ActionButton(
                icon: "heart",
                count: stats.likes,
                color: .red,
                isFilled: stats.isLiked
            )
            Spacer()
            ActionButton(
                icon: "bookmark",
                count: stats.bookmarks,
                color: .gray
            )
            Spacer()
            Button(action: {}) {
                Image(systemName: "square.and.arrow.up")
                    .foregroundColor(.gray)
                    .font(.system(size: 18))
            }
        }
        .padding(.vertical, 8)
    }
}

struct ActionButton: View {
    let icon: String
    let count: Int
    let color: Color
    var isFilled: Bool = false
    
    var body: some View {
        Button(action: {}) {
            HStack(spacing: 6) {
                Image(systemName: isFilled ? icon + ".fill" : icon)
                    .foregroundColor(color)
                    .font(.system(size: 18))
                if count > 0 {
                    Text(formatCount(count))
                        .foregroundColor(color)
                        .font(.system(size: 14))
                }
            }
        }
    }
    
    private func formatCount(_ count: Int) -> String {
        if count >= 10000 {
            return String(format: "%.1f万", Double(count) / 10000.0)
        } else if count >= 1000 {
            return String(format: "%.1fk", Double(count) / 1000.0)
        }
        return "\(count)"
    }
}

struct ReplyComposerBar: View {
    let profile: TweetProfile
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            AsyncImage(url: profile.avatarURL) { image in
                image.resizable()
            } placeholder: {
                Circle()
                    .fill(Color.gray.opacity(0.3))
            }
            .frame(width: 36, height: 36)
            .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(profile.displayName)
                        .foregroundColor(.white)
                        .font(.system(size: 15, weight: .semibold))
                    if profile.isVerified {
                        Image(systemName: "checkmark.seal.fill")
                            .foregroundColor(.blue)
                            .font(.system(size: 14))
                    }
                    Text(profile.handle)
                        .foregroundColor(.gray)
                        .font(.system(size: 14))
                    Text("•")
                        .foregroundColor(.gray)
                        .font(.system(size: 13))
                    Text(profile.timestamp)
                        .foregroundColor(.gray)
                        .font(.system(size: 14))
                }
                TextField(Localized.replyPlaceholder, text: .constant(""))
                    .textFieldStyle(.plain)
                    .foregroundColor(.white)
                    .font(.system(size: 17))
                    .padding(.vertical, 12)
                    .padding(.horizontal, 16)
                    .background(Color.white.opacity(0.05))
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                    )
            }
        }
        .padding(.top, 8)
    }
}

struct TweetDetailViewModel {
    let profile: TweetProfile
    let body: [LocalizedStringKey]
    let attachment: LinkAttachment?
    let quotedTweet: QuotedTweet?
    let stats: TweetStats
    let currentUserProfile: TweetProfile

    init(source: TweetDataSource = .shared) {
        self.profile = source.profile()
        self.body = source.body()
        self.attachment = source.link()
        self.quotedTweet = source.quotedTweet()
        self.stats = source.stats()
        self.currentUserProfile = source.currentUserProfile()
    }
}

struct TweetProfile {
    let displayName: LocalizedStringKey
    let handle: LocalizedStringKey
    let avatarURL: URL?
    let isVerified: Bool
    let isPremium: Bool
    let timestamp: LocalizedStringKey
    let source: LocalizedStringKey
}

struct LinkAttachment {
    let title: LocalizedStringKey
    let subtitle: LocalizedStringKey
    let host: LocalizedStringKey
    let logoURL: URL?
}

struct QuotedTweet {
    let authorName: LocalizedStringKey
    let authorHandle: LocalizedStringKey
    let authorAvatarURL: URL?
    let isVerified: Bool
    let body: LocalizedStringKey
    let timestamp: LocalizedStringKey
    let hasMore: Bool
}

struct TweetStats {
    let timestamp: LocalizedStringKey
    let date: LocalizedStringKey
    let views: LocalizedStringKey
    let comments: Int
    let reposts: Int
    let quotes: Int
    let likes: Int
    let bookmarks: Int
    let isLiked: Bool
}

final class TweetDataSource {
    static let shared = TweetDataSource()

    func profile() -> TweetProfile {
        TweetProfile(
            displayName: Localized.authorName,
            handle: Localized.authorHandle,
            avatarURL: URL(string: Localized.authorAvatarURL),
            isVerified: true,
            isPremium: true,
            timestamp: Localized.postTimestamp,
            source: Localized.postSource
        )
    }

    func body() -> [LocalizedStringKey] {
        [Localized.paragraphOne, Localized.paragraphTwo]
    }

    func link() -> LinkAttachment? {
        LinkAttachment(
            title: Localized.linkTitle,
            subtitle: Localized.linkSubtitle,
            host: Localized.linkHost,
            logoURL: URL(string: Localized.linkLogoURL)
        )
    }

    func quotedTweet() -> QuotedTweet? {
        QuotedTweet(
            authorName: Localized.quotedAuthorName,
            authorHandle: Localized.quotedAuthorHandle,
            authorAvatarURL: URL(string: Localized.quotedAuthorAvatarURL),
            isVerified: true,
            body: Localized.quotedBody,
            timestamp: Localized.quotedTimestamp,
            hasMore: true
        )
    }

    func stats() -> TweetStats {
        TweetStats(
            timestamp: Localized.timestamp,
            date: Localized.date,
            views: Localized.views,
            comments: 1,
            reposts: 19,
            quotes: 0,
            likes: 176,
            bookmarks: 23,
            isLiked: false
        )
    }

    func currentUserProfile() -> TweetProfile {
        TweetProfile(
            displayName: Localized.currentUserName,
            handle: Localized.currentUserHandle,
            avatarURL: URL(string: Localized.currentUserAvatarURL),
            isVerified: true,
            isPremium: false,
            timestamp: Localized.currentUserTimestamp,
            source: Localized.postSource
        )
    }
}

enum Localized {
    static let tweetTitle = LocalizedStringKey("tweet.title")
    static let authorName = LocalizedStringKey("tweet.author.name")
    static let authorHandle = LocalizedStringKey("tweet.author.handle")
    static let authorAvatarURL = "tweet.author.avatar.url"
    static let postTimestamp = LocalizedStringKey("tweet.post.timestamp")
    static let postSource = LocalizedStringKey("tweet.post.source")
    static let paragraphOne = LocalizedStringKey("tweet.body.paragraph.one")
    static let paragraphTwo = LocalizedStringKey("tweet.body.paragraph.two")
    static let showTranslation = LocalizedStringKey("tweet.body.show.translation")
    static let linkTitle = LocalizedStringKey("tweet.link.title")
    static let linkSubtitle = LocalizedStringKey("tweet.link.subtitle")
    static let linkHost = LocalizedStringKey("tweet.link.host")
    static let linkLogoURL = "tweet.link.logo.url"
    static let quotedAuthorName = LocalizedStringKey("tweet.quoted.author.name")
    static let quotedAuthorHandle = LocalizedStringKey("tweet.quoted.author.handle")
    static let quotedAuthorAvatarURL = "tweet.quoted.author.avatar.url"
    static let quotedBody = LocalizedStringKey("tweet.quoted.body")
    static let quotedTimestamp = LocalizedStringKey("tweet.quoted.timestamp")
    static let whatsNew = LocalizedStringKey("tweet.quoted.whats.new")
    static let timestamp = LocalizedStringKey("tweet.meta.timestamp")
    static let date = LocalizedStringKey("tweet.meta.date")
    static let views = LocalizedStringKey("tweet.meta.views")
    static let replyPlaceholder = LocalizedStringKey("tweet.reply.placeholder")
    static let currentUserName = LocalizedStringKey("tweet.current.user.name")
    static let currentUserHandle = LocalizedStringKey("tweet.current.user.handle")
    static let currentUserAvatarURL = "tweet.current.user.avatar.url"
    static let currentUserTimestamp = LocalizedStringKey("tweet.current.user.timestamp")
}
`;

function SwiftUIEmbedded({}: ThemeComponentProps) {
  const debugLine = 20;

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden border border-white/10 bg-[#111114] shadow-[0_30px_80px_rgba(5,10,25,0.45)]">
      <div className="flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden">
        <CodeBlock 
          code={SWIFTUI_CODE} 
          language="swift" 
          variant="frameless"
          highlightLine={debugLine}
          scrollToLine={debugLine}
        />
      </div>
    </div>
  );
}

function SwiftUIStandalone() {
  const debugLine = 20;

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden border-[#2A2A2E] bg-[#1C1C1E] shadow-[0_40px_120px_rgba(6,12,26,0.55)] lg:max-w-4xl">
      <main className="flex-1 overflow-auto bg-[#111114]">
        <CodeBlock 
          code={SWIFTUI_CODE} 
          language="swift" 
          variant="frameless"
          highlightLine={debugLine}
          scrollToLine={debugLine}
        />
      </main>
      <footer className="border-t border-[#2C2C30] bg-[#1F1F23] px-5 py-3 text-[11px] text-slate-400">
        Live Preview • X-Windows Playground • SwiftUI Edition
      </footer>
    </div>
  );
}

function SwiftUIThemeComponent(props: ThemeComponentProps) {
  const { mode = "embedded" } = props;
  if (mode === "standalone") {
    return <SwiftUIStandalone />;
  }

  return <SwiftUIEmbedded platform={props.platform} />;
}

export const swiftuiTheme: ThemeDefinition = {
  id: "swiftui",
  label: "SwiftUI Code",
  description: "Present SwiftUI editor experience in X-style page",
  kind: "code",
  component: SwiftUIThemeComponent,
  accentColor: "#0A84FF",
  supportedPlatforms: ["ios", "desktop"],
  icon: SwiftIcon,
};
