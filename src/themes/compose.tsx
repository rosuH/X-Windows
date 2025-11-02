import { CodeBlock } from "@/components/code-block";
import type { ThemeComponentProps } from "@/themes/types";
import type { ThemeDefinition } from "@/themes/types";
import { AndroidHead3DIcon } from "@/lib/icons";

const COMPOSE_CODE = `import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.IosShare
import androidx.compose.material.icons.outlined.Repeat
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun TweetDetailScreen(source: TweetRepository = TweetRepository.default()) {
    val tweet = remember { source.tweet() }

    Column(
        modifier = Modifier.fillMaxSize().background(Color.Black)
    ) {
        TopBar(title = Strings.tweetTitle)
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(20.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            item { AuthorRow(tweet.profile) }
            item { TweetBody(tweet.paragraphs) }
            tweet.attachment?.let { link ->
                item { LinkPreview(link) }
            }
            item { MetaSection(tweet.stats) }
        }
    }
}

data class Tweet(
    val profile: TweetProfile,
    val paragraphs: List<String>,
    val attachment: LinkAttachment?,
    val stats: TweetStats
)

data class TweetProfile(val displayName: String, val handle: String)

data class LinkAttachment(val title: String, val subtitle: String, val host: String)

data class TweetStats(
    val timestamp: String,
    val views: String,
    val comments: Int,
    val reposts: Int,
    val likes: Int,
    val quotes: Int
)

class TweetRepository private constructor() {
    fun tweet(): Tweet = Tweet(
        profile = TweetProfile(Strings.authorName, Strings.authorHandle),
        paragraphs = listOf(Strings.bodyParagraphOne, Strings.bodyParagraphTwo),
        attachment = LinkAttachment(Strings.linkTitle, Strings.linkSubtitle, Strings.linkHost),
        stats = TweetStats(
            timestamp = Strings.metaTimestamp,
            views = Strings.metaViews,
            comments = 3,
            reposts = 8,
            likes = 42,
            quotes = 5
        )
    )

    companion object {
        fun default() = TweetRepository()
    }
}

data object Strings {
    const val tweetTitle = "tweet.title"
    const val authorName = "tweet.author.name"
    const val authorHandle = "tweet.author.handle"
    const val bodyParagraphOne = "tweet.body.paragraph.one"
    const val bodyParagraphTwo = "tweet.body.paragraph.two"
    const val linkTitle = "tweet.link.title"
    const val linkSubtitle = "tweet.link.subtitle"
    const val linkHost = "tweet.link.host"
    const val metaTimestamp = "tweet.meta.timestamp"
    const val metaViews = "tweet.meta.views"
}
`;

function ComposeEmbedded({}: ThemeComponentProps) {
  const debugLine = 33;

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden border border-white/10 bg-[#0D1513] shadow-[0_30px_80px_rgba(3,15,12,0.45)]">
      <div className="flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden">
        <CodeBlock 
          code={COMPOSE_CODE} 
          language="kotlin" 
          variant="frameless"
          highlightLine={debugLine}
          scrollToLine={debugLine}
          debugStyle="android"
        />
      </div>
    </div>
  );
}

function ComposeStandalone() {
  const debugLine = 33;

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden border border-[#1F2A26] bg-[#111716] shadow-[0_40px_120px_rgba(3,20,15,0.6)] lg:max-w-4xl">
      <main className="flex-1 overflow-auto bg-[#0B1211]">
        <CodeBlock 
          code={COMPOSE_CODE} 
          language="kotlin" 
          variant="frameless"
          highlightLine={debugLine}
          scrollToLine={debugLine}
          debugStyle="android"
        />
      </main>
      <footer className="border-t border-[#1C2622] bg-[#101917] px-5 py-3 text-[11px] text-emerald-200/70">
        Compose Preview • X-Windows Playground • Android Edition
      </footer>
    </div>
  );
}

function ComposeThemeComponent(props: ThemeComponentProps) {
  const { mode = "embedded" } = props;
  if (mode === "standalone") {
    return <ComposeStandalone />;
  }

  return <ComposeEmbedded platform={props.platform} />;
}

export const composeTheme: ThemeDefinition = {
  id: "compose",
  label: "Compose UI",
  description: "Present Jetpack Compose editor experience for Android visitors",
  kind: "code",
  component: ComposeThemeComponent,
  accentColor: "#3DDC84",
  supportedPlatforms: ["android", "desktop"],
  icon: AndroidHead3DIcon,
};
