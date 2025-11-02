import { CodeBlock } from "@/components/code-block";
import type { ThemeComponentProps } from "@/themes/types";
import type { ThemeDefinition } from "@/themes/types";
import { AndroidHead3DIcon } from "@/lib/icons";

const COMPOSE_CODE = `import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Link
import androidx.compose.material.icons.filled.RemoveRedEye
import androidx.compose.material.icons.outlined.BookmarkBorder
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@Composable
fun TweetDetailScreen(
    source: TweetRepository = TweetRepository.default(),
    onBack: () -> Unit = {}
) {
    val tweet = remember { source.tweet() }

    Column(
        modifier = Modifier.fillMaxSize().background(Color.Black)
    ) {
        TopBar(title = Strings.tweetTitle, onBack = onBack)
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            item { AuthorRow(tweet.profile) }
            item { TweetBody(tweet.paragraphs) }
            tweet.attachment?.let { link ->
                item { LinkPreview(link) }
            }
            tweet.quotedTweet?.let { quoted ->
                item { QuotedPost(quoted) }
            }
            item {
                HorizontalDivider(
                    modifier = Modifier.padding(vertical = 8.dp),
                    color = Color.White.copy(alpha = 0.1f)
                )
            }
            item { MetaSection(tweet.stats) }
            item { ActionToolbar(tweet.stats) }
            item { ReplyComposerBar(tweet.currentUserProfile) }
        }
    }
}

@Composable
fun TopBar(title: String, onBack: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onBack) {
            Icon(
                imageVector = Icons.Filled.ArrowBack,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(24.dp)
            )
        }
        Text(
            text = title,
            color = Color.White,
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold
        )
        IconButton(onClick = {}) {
            Icon(
                imageVector = Icons.Filled.MoreVert,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(24.dp)
            )
        }
    }
}

@Composable
fun AuthorRow(profile: TweetProfile) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.Start,
        verticalAlignment = Alignment.Top
    ) {
        AsyncImage(
            model = profile.avatarURL,
            contentDescription = null,
            modifier = Modifier
                .size(48.dp)
                .clip(CircleShape),
            contentScale = ContentScale.Crop
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = profile.displayName,
                    color = Color.White,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                if (profile.isVerified) {
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(
                        imageVector = Icons.Filled.CheckCircle,
                        contentDescription = null,
                        tint = Color(0xFF1DA1F2),
                        modifier = Modifier.size(16.dp)
                    )
                }
                if (profile.isPremium) {
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(
                        imageVector = Icons.Filled.Star,
                        contentDescription = null,
                        tint = Color(0xFFFF6B6B),
                        modifier = Modifier.size(14.dp)
                    )
                }
                Spacer(modifier = Modifier.weight(1f))
                Text(
                    text = profile.source,
                    color = Color.Gray,
                    fontSize = 14.sp
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                horizontalArrangement = Arrangement.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = profile.handle,
                    color = Color.Gray,
                    fontSize = 15.sp
                )
                Text(
                    text = " • ",
                    color = Color.Gray,
                    fontSize = 14.sp
                )
                Text(
                    text = profile.timestamp,
                    color = Color.Gray,
                    fontSize = 15.sp
                )
            }
        }
    }
}

@Composable
fun TweetBody(paragraphs: List<String>) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        paragraphs.forEach { paragraph ->
            Text(
                text = paragraph,
                color = Color.White,
                fontSize = 17.sp,
                lineHeight = 24.sp
            )
        }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "🚀", fontSize = 20.sp)
                Text(text = "👇", fontSize = 20.sp)
            }
            TextButton(onClick = {}) {
                Text(
                    text = Strings.showTranslation,
                    color = Color(0xFF1DA1F2),
                    fontSize = 15.sp
                )
            }
        }
    }
}

@Composable
fun LinkPreview(attachment: LinkAttachment) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.05f)
        ),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.1f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = attachment.title,
                    color = Color.White,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = attachment.subtitle,
                    color = Color.Gray,
                    fontSize = 14.sp,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Filled.Link,
                        contentDescription = null,
                        tint = Color.Gray,
                        modifier = Modifier.size(12.dp)
                    )
                    Text(
                        text = attachment.host,
                        color = Color.Gray,
                        fontSize = 13.sp
                    )
                }
            }
            attachment.logoURL?.let { url ->
                Spacer(modifier = Modifier.width(12.dp))
                AsyncImage(
                    model = url,
                    contentDescription = null,
                    modifier = Modifier
                        .size(64.dp)
                        .clip(RoundedCornerShape(8.dp)),
                    contentScale = ContentScale.Crop
                )
            }
        }
    }
}

@Composable
fun QuotedPost(quoted: QuotedTweet) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.03f)
        ),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.08f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.Start,
            verticalAlignment = Alignment.Top
        ) {
            AsyncImage(
                model = quoted.authorAvatarURL,
                contentDescription = null,
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape),
                contentScale = ContentScale.Crop
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    horizontalArrangement = Arrangement.Start,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = quoted.authorName,
                        color = Color.White,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    if (quoted.isVerified) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            tint = Color(0xFF1DA1F2),
                            modifier = Modifier.size(14.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = quoted.authorHandle,
                        color = Color.Gray,
                        fontSize = 14.sp
                    )
                    Text(
                        text = " • ",
                        color = Color.Gray,
                        fontSize = 13.sp
                    )
                    Text(
                        text = quoted.timestamp,
                        color = Color.Gray,
                        fontSize = 14.sp
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = quoted.body,
                    color = Color.White,
                    fontSize = 15.sp,
                    maxLines = 3,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 20.sp
                )
                if (quoted.hasMore) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = Strings.whatsNew,
                        color = Color.Gray,
                        fontSize = 14.sp
                    )
                }
            }
        }
    }
}

@Composable
fun MetaSection(stats: TweetStats) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.Start,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = stats.timestamp,
            color = Color.Gray,
            fontSize = 14.sp
        )
        Text(
            text = " • ",
            color = Color.Gray,
            fontSize = 13.sp
        )
        Text(
            text = stats.date,
            color = Color.Gray,
            fontSize = 14.sp
        )
        Text(
            text = " • ",
            color = Color.Gray,
            fontSize = 13.sp
        )
        Row(
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Filled.RemoveRedEye,
                contentDescription = null,
                tint = Color.Gray,
                modifier = Modifier.size(12.dp)
            )
            Text(
                text = stats.views,
                color = Color.Gray,
                fontSize = 14.sp
            )
        }
    }
}

@Composable
fun ActionToolbar(stats: TweetStats) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
    ) {
        ActionButton(
            icon = Icons.Outlined.ChatBubbleOutline,
            count = stats.comments,
            onClick = {}
        )
        ActionButton(
            icon = Icons.Outlined.Repeat,
            count = stats.reposts + stats.quotes,
            onClick = {}
        )
        ActionButton(
            icon = if (stats.isLiked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
            count = stats.likes,
            onClick = {},
            tint = if (stats.isLiked) Color(0xFFF91880) else Color.Gray
        )
        ActionButton(
            icon = Icons.Outlined.BookmarkBorder,
            count = stats.bookmarks,
            onClick = {}
        )
        IconButton(onClick = {}) {
            Icon(
                imageVector = Icons.Outlined.IosShare,
                contentDescription = null,
                tint = Color.Gray,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}

@Composable
fun ActionButton(
    icon: ImageVector,
    count: Int,
    onClick: () -> Unit,
    tint: Color = Color.Gray
) {
    Row(
        modifier = Modifier.clickable(onClick = onClick),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = tint,
            modifier = Modifier.size(20.dp)
        )
        if (count > 0) {
            Text(
                text = formatCount(count),
                color = tint,
                fontSize = 14.sp
            )
        }
    }
}

@Composable
fun ReplyComposerBar(profile: TweetProfile) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.Start,
        verticalAlignment = Alignment.Top
    ) {
        AsyncImage(
            model = profile.avatarURL,
            contentDescription = null,
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape),
            contentScale = ContentScale.Crop
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Row(
                horizontalArrangement = Arrangement.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = profile.displayName,
                    color = Color.White,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold
                )
                if (profile.isVerified) {
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = Color(0xFF1DA1F2),
                        modifier = Modifier.size(14.dp)
                    )
                }
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = profile.handle,
                    color = Color.Gray,
                    fontSize = 14.sp
                )
                Text(
                    text = " • ",
                    color = Color.Gray,
                    fontSize = 13.sp
                )
                Text(
                    text = profile.timestamp,
                    color = Color.Gray,
                    fontSize = 14.sp
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            OutlinedTextField(
                value = "",
                onValueChange = {},
                modifier = Modifier.fillMaxWidth(),
                placeholder = {
                    Text(
                        text = Strings.replyPlaceholder,
                        color = Color.Gray
                    )
                },
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedTextColor = Color.White,
                    unfocusedBorderColor = Color.White.copy(alpha = 0.1f),
                    unfocusedContainerColor = Color.White.copy(alpha = 0.05f)
                ),
                shape = RoundedCornerShape(20.dp),
                singleLine = false,
                maxLines = 4
            )
        }
    }
}

fun formatCount(count: Int): String {
    return when {
        count >= 10000 -> String.format("%.1f万", count / 10000.0)
        count >= 1000 -> String.format("%.1fk", count / 1000.0)
        else -> count.toString()
    }
}

data class Tweet(
    val profile: TweetProfile,
    val paragraphs: List<String>,
    val attachment: LinkAttachment?,
    val quotedTweet: QuotedTweet?,
    val stats: TweetStats,
    val currentUserProfile: TweetProfile
)

data class TweetProfile(
    val displayName: String,
    val handle: String,
    val avatarURL: String?,
    val isVerified: Boolean,
    val isPremium: Boolean,
    val timestamp: String,
    val source: String
)

data class LinkAttachment(
    val title: String,
    val subtitle: String,
    val host: String,
    val logoURL: String?
)

data class QuotedTweet(
    val authorName: String,
    val authorHandle: String,
    val authorAvatarURL: String?,
    val isVerified: Boolean,
    val body: String,
    val timestamp: String,
    val hasMore: Boolean
)

data class TweetStats(
    val timestamp: String,
    val date: String,
    val views: String,
    val comments: Int,
    val reposts: Int,
    val quotes: Int,
    val likes: Int,
    val bookmarks: Int,
    val isLiked: Boolean
)

class TweetRepository private constructor() {
    fun tweet(): Tweet = Tweet(
        profile = TweetProfile(
            displayName = Strings.authorName,
            handle = Strings.authorHandle,
            avatarURL = Strings.authorAvatarURL,
            isVerified = true,
            isPremium = true,
            timestamp = Strings.postTimestamp,
            source = Strings.postSource
        ),
        paragraphs = listOf(Strings.bodyParagraphOne, Strings.bodyParagraphTwo),
        attachment = LinkAttachment(
            title = Strings.linkTitle,
            subtitle = Strings.linkSubtitle,
            host = Strings.linkHost,
            logoURL = Strings.linkLogoURL
        ),
        quotedTweet = QuotedTweet(
            authorName = Strings.quotedAuthorName,
            authorHandle = Strings.quotedAuthorHandle,
            authorAvatarURL = Strings.quotedAuthorAvatarURL,
            isVerified = true,
            body = Strings.quotedBody,
            timestamp = Strings.quotedTimestamp,
            hasMore = true
        ),
        stats = TweetStats(
            timestamp = Strings.metaTimestamp,
            date = Strings.metaDate,
            views = Strings.metaViews,
            comments = 1,
            reposts = 19,
            quotes = 0,
            likes = 176,
            bookmarks = 23,
            isLiked = false
        ),
        currentUserProfile = TweetProfile(
            displayName = Strings.currentUserName,
            handle = Strings.currentUserHandle,
            avatarURL = Strings.currentUserAvatarURL,
            isVerified = true,
            isPremium = false,
            timestamp = Strings.currentUserTimestamp,
            source = Strings.postSource
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
    const val authorAvatarURL = "tweet.author.avatar.url"
    const val postTimestamp = "tweet.post.timestamp"
    const val postSource = "tweet.post.source"
    const val bodyParagraphOne = "tweet.body.paragraph.one"
    const val bodyParagraphTwo = "tweet.body.paragraph.two"
    const val showTranslation = "tweet.body.show.translation"
    const val linkTitle = "tweet.link.title"
    const val linkSubtitle = "tweet.link.subtitle"
    const val linkHost = "tweet.link.host"
    const val linkLogoURL = "tweet.link.logo.url"
    const val quotedAuthorName = "tweet.quoted.author.name"
    const val quotedAuthorHandle = "tweet.quoted.author.handle"
    const val quotedAuthorAvatarURL = "tweet.quoted.author.avatar.url"
    const val quotedBody = "tweet.quoted.body"
    const val quotedTimestamp = "tweet.quoted.timestamp"
    const val whatsNew = "tweet.quoted.whats.new"
    const val metaTimestamp = "tweet.meta.timestamp"
    const val metaDate = "tweet.meta.date"
    const val metaViews = "tweet.meta.views"
    const val replyPlaceholder = "tweet.reply.placeholder"
    const val currentUserName = "tweet.current.user.name"
    const val currentUserHandle = "tweet.current.user.handle"
    const val currentUserAvatarURL = "tweet.current.user.avatar.url"
    const val currentUserTimestamp = "tweet.current.user.timestamp"
}
`;

function ComposeEmbedded({}: ThemeComponentProps) {
  const debugLine = 53;

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
  const debugLine = 53;

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
