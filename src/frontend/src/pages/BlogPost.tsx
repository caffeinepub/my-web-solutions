import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBlogPost, useListBlogPosts } from "@/hooks/useQueries";
import {
  type BlogCategory,
  categoryColors,
  getBlogCategory,
} from "@/utils/blogCategory";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Link2,
  Linkedin,
  MessageCircle,
  Share2,
  Twitter,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function shareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(`${title} ${window.location.href}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap py-4 border-y border-border mb-8">
      <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mr-1">
        <Share2 className="w-4 h-4" />
        Share
      </span>
      <button
        type="button"
        onClick={shareWhatsApp}
        data-ocid="blog_post.share_whatsapp_button"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent transition-all duration-200"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5 text-green-600" />
        WhatsApp
      </button>
      <button
        type="button"
        onClick={shareTwitter}
        data-ocid="blog_post.share_twitter_button"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent transition-all duration-200"
        aria-label="Share on X / Twitter"
      >
        <Twitter className="w-3.5 h-3.5 text-sky-500" />X / Twitter
      </button>
      <button
        type="button"
        onClick={shareLinkedIn}
        data-ocid="blog_post.share_linkedin_button"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent transition-all duration-200"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5 text-blue-700" />
        LinkedIn
      </button>
      <button
        type="button"
        onClick={copyLink}
        data-ocid="blog_post.share_copy_button"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent transition-all duration-200"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-600" />
        ) : (
          <Link2 className="w-3.5 h-3.5" />
        )}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

function RelatedPosts({
  currentPostId,
  currentCategory,
}: {
  currentPostId: bigint;
  currentCategory: BlogCategory;
}) {
  const { data: posts = [] } = useListBlogPosts();

  const related = posts
    .filter(
      (p) => p.id !== currentPostId && getBlogCategory(p) === currentCategory,
    )
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-12" data-ocid="blog_post.related_posts_section">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {related.map((post, index) => {
          const cat = getBlogCategory(post);
          const badgeColors = categoryColors[cat];
          return (
            <motion.div
              key={post.id.toString()}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to="/blog/$id" params={{ id: post.id.toString() }}>
                <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 border-border group cursor-pointer">
                  <CardContent className="p-4 flex flex-col h-full">
                    <Badge
                      variant="outline"
                      className={`text-xs border self-start mb-3 ${badgeColors}`}
                    >
                      {cat}
                    </Badge>
                    <h3 className="font-display text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2 flex-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      Read more
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function BlogPostPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const postId = id ? BigInt(id) : null;
  const { data: post, isLoading } = useGetBlogPost(postId);

  const currentCategory = post ? getBlogCategory(post) : null;
  const badgeColors = currentCategory ? categoryColors[currentCategory] : "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 md:pt-36">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-8 text-muted-foreground hover:text-foreground -ml-2"
            data-ocid="blog_post.back_button"
          >
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Blog
            </Link>
          </Button>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-3 mt-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ) : !post ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
              data-ocid="blog_post.error_state"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                Post not found
              </h2>
              <p className="text-muted-foreground mb-6">
                This post may have been removed or the link is incorrect.
              </p>
              <Button asChild data-ocid="blog_post.back_link">
                <Link to="/blog">Back to Blog</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category Badge */}
              {currentCategory && (
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <Badge
                    variant="outline"
                    className={`text-xs border ${badgeColors}`}
                  >
                    {currentCategory}
                  </Badge>
                </div>
              )}

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-6">
                {post.title}
              </h1>

              {/* Author & Date */}
              <div className="flex items-center gap-4 pb-6 border-b border-border mb-0 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {post.authorName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                {post.updatedAt !== post.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    Updated: {formatDate(post.updatedAt)}
                  </span>
                )}
              </div>

              {/* Social Share Buttons */}
              <ShareButtons title={post.title} />

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 italic border-l-4 border-primary/30 pl-4">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div className="prose prose-blue max-w-none">
                {post.content.split("\n\n").map((block) => (
                  <p
                    key={block.slice(0, 40)}
                    className="text-foreground leading-relaxed mb-4 text-base"
                  >
                    {block}
                  </p>
                ))}
              </div>

              {/* CTA */}
              <div
                className="mt-12 rounded-2xl p-6 md:p-8 border border-primary/15 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.93 0.04 255 / 1), oklch(0.97 0.02 255 / 1))",
                }}
              >
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Need help with your project?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Chat with us directly on WhatsApp for a quick consultation.
                </p>
                <Button asChild size="sm" className="font-semibold">
                  <a
                    href="https://wa.me/919901563799"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="blog_post.whatsapp_button"
                  >
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>

              {/* Related Posts */}
              {currentCategory && postId && (
                <RelatedPosts
                  currentPostId={postId}
                  currentCategory={currentCategory}
                />
              )}
            </motion.article>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
