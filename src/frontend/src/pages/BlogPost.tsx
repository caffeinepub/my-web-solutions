import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBlogPost } from "@/hooks/useQueries";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { motion } from "motion/react";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogPostPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const postId = id ? BigInt(id) : null;
  const { data: post, isLoading } = useGetBlogPost(postId);

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
              {/* Meta */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest">
                  Article
                </div>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-6">
                {post.title}
              </h1>

              {/* Author & Date */}
              <div className="flex items-center gap-4 pb-6 border-b border-border mb-8 flex-wrap">
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
            </motion.article>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
