import { CodeBlock } from "@/components/code-block";
import type { ThemeComponentProps } from "@/themes/types";
import type { ThemeDefinition } from "@/themes/types";
import { Bird } from "lucide-react";

const SWIFTUI_CODE = `import SwiftUI

struct TweetDetailView: View {
    @State private var viewModel = TweetDetailViewModel()

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            VStack(spacing: 0) {
                TopBar(title: Localized.tweetTitle)
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        AuthorRow(profile: viewModel.profile)
                        TweetBody(paragraphs: viewModel.body)
                        if let attachment = viewModel.attachment {
                            LinkPreview(attachment: attachment)
                        }
                        MetaSection(stats: viewModel.stats)
                    }
                    .padding(20)
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}

struct TweetDetailViewModel {
    let profile: TweetProfile
    let body: [LocalizedStringKey]
    let attachment: LinkAttachment?
    let stats: TweetStats

    init(source: TweetDataSource = .shared) {
        self.profile = source.profile()
        self.body = source.body()
        self.attachment = source.link()
        self.stats = source.stats()
    }
}

struct TweetProfile {
    let displayName: LocalizedStringKey
    let handle: LocalizedStringKey
}

struct LinkAttachment {
    let title: LocalizedStringKey
    let subtitle: LocalizedStringKey
    let host: LocalizedStringKey
}

struct TweetStats {
    let timestamp: LocalizedStringKey
    let views: LocalizedStringKey
    let comments: Int
    let reposts: Int
    let likes: Int
    let quotes: Int
}

final class TweetDataSource {
    static let shared = TweetDataSource()

    func profile() -> TweetProfile {
        TweetProfile(displayName: Localized.authorName, handle: Localized.authorHandle)
    }

    func body() -> [LocalizedStringKey] {
        [Localized.paragraphOne, Localized.paragraphTwo]
    }

    func link() -> LinkAttachment? {
        LinkAttachment(title: Localized.linkTitle, subtitle: Localized.linkSubtitle, host: Localized.linkHost)
    }

    func stats() -> TweetStats {
        TweetStats(
            timestamp: Localized.timestamp,
            views: Localized.views,
            comments: 3,
            reposts: 8,
            likes: 42,
            quotes: 5
        )
    }
}

enum Localized {
    static let tweetTitle = LocalizedStringKey("tweet.title")
    static let authorName = LocalizedStringKey("tweet.author.name")
    static let authorHandle = LocalizedStringKey("tweet.author.handle")
    static let paragraphOne = LocalizedStringKey("tweet.body.paragraph.one")
    static let paragraphTwo = LocalizedStringKey("tweet.body.paragraph.two")
    static let linkTitle = LocalizedStringKey("tweet.link.title")
    static let linkSubtitle = LocalizedStringKey("tweet.link.subtitle")
    static let linkHost = LocalizedStringKey("tweet.link.host")
    static let timestamp = LocalizedStringKey("tweet.meta.timestamp")
    static let views = LocalizedStringKey("tweet.meta.views")
}
`;

function SwiftUIEmbedded({}: ThemeComponentProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111114] shadow-[0_30px_80px_rgba(5,10,25,0.45)]">
      <CodeBlock code={SWIFTUI_CODE} language="swift" variant="frameless" />
    </div>
  );
}

function SwiftUIStandalone() {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-[#2A2A2E] bg-[#1C1C1E] shadow-[0_40px_120px_rgba(6,12,26,0.55)] lg:max-w-4xl">
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-52 flex-col border-r border-[#2C2C30] bg-[#1F1F23] px-4 py-4 text-xs text-slate-400 lg:flex">
          <div className="mb-4 text-[11px] uppercase tracking-[0.2em] text-slate-500">Playground</div>
          <div className="space-y-2">
            <div className="rounded-lg bg-[#2A2A2E] px-2 py-2 text-slate-200">Editor.swift</div>
            <div className="rounded-lg px-2 py-2 hover:bg-[#242428]">Tabs.swift</div>
            <div className="rounded-lg px-2 py-2 hover:bg-[#242428]">Canvas.swift</div>
            <div className="rounded-lg px-2 py-2 hover:bg-[#242428]">Preview.swift</div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto bg-[#111114]">
          <CodeBlock code={SWIFTUI_CODE} language="swift" variant="frameless" />
        </main>
      </div>
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
  description: "在 X 风格页面中展示 SwiftUI 编辑器体验",
  kind: "code",
  component: SwiftUIThemeComponent,
  accentColor: "#0A84FF",
  supportedPlatforms: ["ios", "desktop"],
  icon: Bird,
};
