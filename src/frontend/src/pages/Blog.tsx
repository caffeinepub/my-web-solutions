import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useListBlogPosts } from "@/hooks/useQueries";
import {
  ALL_CATEGORIES,
  type BlogCategory,
  categoryColors,
  getBlogCategory,
} from "@/utils/blogCategory";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Calendar, Search, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type FilterCategory = "All" | BlogCategory;

const ALL_FILTER_CATEGORIES: FilterCategory[] = ["All", ...ALL_CATEGORIES];

export function Blog() {
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");

  useEffect(() => {
    document.title = "Blog | My Web Solutions";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content =
      "Articles and insights on web development, corporate security, government services, and small business digital transformation.";
    if (metaDesc) metaDesc.setAttribute("content", content);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  const { data: posts = [], isLoading } = useListBlogPosts();

  const filteredPosts = useMemo(() => {
    let result = posts;

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter(
        (post) => getBlogCategory(post) === activeCategory,
      );
    }

    // Search filter
    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q),
      );
    }

    return result;
  }, [posts, searchText, activeCategory]);

  const hasActiveFilters = searchText.trim() !== "" || activeCategory !== "All";

  function clearFilters() {
    setSearchText("");
    setActiveCategory("All");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-12 bg-background hero-grid border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-5">
              Insights & Updates
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-4">
              Blog &amp; News
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mb-8">
              Expert insights on web development, SaaS, security certifications,
              and government digital services.
            </p>

            {/* Search bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 bg-background border-border"
                data-ocid="blog.search_input"
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <div className="border-b border-border bg-background sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div
            className="flex gap-1 overflow-x-auto py-3 scrollbar-none"
            data-ocid="blog.tab"
            role="tablist"
            aria-label="Filter by category"
          >
            {ALL_FILTER_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border
                  ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="shadow-card">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-4" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-6" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <AnimatePresence mode="wait">
              {hasActiveFilters ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  data-ocid="blog.empty_state"
                  className="text-center py-20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-5">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                    No posts found for this filter
                  </h2>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                    Try adjusting your search or selecting a different category.
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    data-ocid="blog.secondary_button"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear filters
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  data-ocid="blog.empty_state"
                  className="text-center py-20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-5">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                    No posts yet
                  </h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Check back soon — we're working on insightful content for
                    you.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post, index) => {
                const category = getBlogCategory(post);
                const badgeColors = categoryColors[category];
                return (
                  <motion.div key={post.id.toString()} variants={itemVariants}>
                    <Link
                      to="/blog/$id"
                      params={{ id: post.id.toString() }}
                      data-ocid={`blog.item.${index + 1}`}
                    >
                      <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border-border group cursor-pointer">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-center justify-between mb-4">
                            <Badge
                              variant="outline"
                              className={`text-xs border ${badgeColors}`}
                            >
                              {category}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(post.createdAt)}
                            </span>
                          </div>

                          <h2 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h2>

                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-5">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <span className="text-xs text-muted-foreground font-medium">
                                {post.authorName}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                              Read more
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
