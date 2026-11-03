import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/react';
import { getCampusPosts, createCampusPost, toggleCampusPostLike, addCampusPostComment } from '../services/api';
import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Search,
  Image,
  CalendarDays,
  MoreHorizontal,
  GraduationCap,
  Megaphone,
  Send,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const initialPosts = [
  {
    id: 1,
    author: 'Priya Sharma',
    initials: 'PS',
    department: 'Computer Science',
    time: '15 minutes ago',
    category: 'Academic',
    title: 'Anyone interested in forming a DSA study group?',
    content:
      'I am planning to solve LeetCode problems every evening this week. Looking for 3–4 students who want to practice together and prepare for placements!',
    likes: 12,
    comments: 4,
    liked: false,
  },
  {
    id: 2,
    author: 'Rahul Verma',
    initials: 'RV',
    department: 'Information Technology',
    time: '1 hour ago',
    category: 'Announcement',
    title: 'Campus Hackathon registrations are open!',
    content:
      'The annual campus hackathon is coming soon! Build a team, bring your ideas, and create something amazing. Beginners are welcome too. Check the Events section for more details.',
    likes: 28,
    comments: 8,
    liked: false,
  },
  {
    id: 3,
    author: 'Ananya Reddy',
    initials: 'AR',
    department: 'Electronics',
    time: '3 hours ago',
    category: 'General',
    title: 'Sharing my React learning resources',
    content:
      'I have collected some useful React tutorials and notes for beginners. If anyone needs help getting started with frontend development, feel free to connect!',
    likes: 19,
    comments: 6,
    liked: false,
  },
];

const postCategories = ['All Posts', 'Academic', 'Announcement', 'General'];

function CampusFeed() {
  const { getToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [showComposer, setShowComposer] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General',
  });

  useEffect(() => { getCampusPosts().then((result) => setPosts(result.posts || [])).catch((error) => toast.error(error.response?.data?.message || 'Unable to load campus posts.')); }, []);

  const filteredPosts = posts.filter((post) => {
    const query = search.toLowerCase();

    const matchesSearch =
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query);

    const matchesCategory =
      activeCategory === 'All Posts' ||
      post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleLike = async (postId) => {
    try { const token = await getToken(); const result = await toggleCampusPostLike(postId, token); setPosts((items) => items.map((post) => post.id === postId || post._id === postId ? { ...post, liked: result.liked, likes: result.likes } : post)); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to update like.'); }
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please enter a title and post content.');
      return;
    }

    try {
      const token = await getToken();
      const result = await createCampusPost({ ...newPost, title: newPost.title.trim(), content: newPost.content.trim() }, token);
      setPosts((items) => [result.post, ...items]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to publish post.');
      return;
    }
    setNewPost({
      title: '',
      content: '',
      category: 'General',
    });
    setActiveCategory('All Posts');
    setSearch('');
    setShowComposer(false);

    toast.success('Your post has been published!');
  };

  const handleComment = async (post) => {
    const content = window.prompt('Write a comment');
    if (!content?.trim()) return;
    try { const token = await getToken(); const result = await addCampusPostComment(post._id || post.id, content, token); setPosts((items) => items.map((item) => item._id === post._id || item.id === post.id ? { ...item, comments: result.comments } : item)); toast.success('Comment added.'); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to add comment.'); }
  };

  const handleShare = async (post) => {
    const shareText = post.title + '\n\n' + post.content;

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: shareText,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        toast.success('Post copied to clipboard!');
      } else {
        toast('Sharing is not supported in this browser.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Unable to share this post.');
      }
    }
  };

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            YOUR CAMPUS COMMUNITY
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Campus Feed
          </h1>

          <p className="mt-2 text-slate-500">
            Share ideas, discover updates, and stay connected with your campus.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowComposer(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus size={19} />
          Create Post
        </button>
      </div>

      {/* Welcome banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white sm:p-8">
        <div className="flex items-center gap-4">
          <div className="hidden rounded-2xl bg-white/15 p-4 sm:block">
            <GraduationCap size={35} />
          </div>

          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              What's happening on campus?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
              Ask questions, share opportunities, find study partners, and
              keep your campus community active.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search posts, topics, or students..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {postCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={
              activeCategory === category
                ? 'rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white'
                : 'rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700'
            }
          >
            {category}
          </button>
        ))}
      </div>

      {/* Feed layout */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        {/* Posts */}
        <div className="space-y-5 xl:col-span-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md sm:p-6"
              >
                {/* Author */}
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                    {post.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {post.author}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {post.department} · {post.time}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="More post options"
                    onClick={() => toast('More post options coming soon.')}
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Post content */}
                <div className="mt-5">
                  <span
                    className={
                      post.category === 'Announcement'
                        ? 'inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700'
                        : post.category === 'Academic'
                          ? 'inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'
                          : 'inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'
                    }
                  >
                    {post.category === 'Announcement' && (
                      <Megaphone size={13} />
                    )}
                    {post.category}
                  </span>

                  <h2 className="mt-3 text-lg font-bold leading-7 text-slate-900">
                    {post.title}
                  </h2>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {post.content}
                  </p>
                </div>

                {/* Counts */}
                <div className="mt-5 flex items-center justify-between border-b border-slate-100 pb-4 text-xs text-slate-500">
                  <span>
                    {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                  </span>

                  <span>
                    {post.comments}{' '}
                    {post.comments === 1 ? 'comment' : 'comments'}
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className={
                      post.liked
                        ? 'flex items-center justify-center gap-2 rounded-xl bg-rose-50 py-3 text-sm font-semibold text-rose-600'
                        : 'flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600'
                    }
                  >
                    <Heart
                      size={18}
                      fill={post.liked ? 'currentColor' : 'none'}
                    />
                    Like
                  </button>

                  <button
                    type="button"
                    onClick={() => handleComment(post)}
                    className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <MessageCircle size={18} />
                    Comment
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(post)}
                    className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Search size={35} className="mx-auto text-slate-300" />

              <h3 className="mt-4 font-bold text-slate-900">
                No posts found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try a different search or choose another category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All Posts');
                }}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Sidebar cards */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <Megaphone size={19} className="text-indigo-600" />

              <h3 className="font-bold text-slate-900">
                Campus Highlights
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-indigo-50 p-4">
                <p className="text-xs font-semibold uppercase text-indigo-600">
                  Academic
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  Prepare together for upcoming exams
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Connect with classmates and exchange study materials.
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase text-amber-700">
                  Community
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  Share your ideas and projects
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Help other students discover what you're building.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <CalendarDays size={19} className="text-indigo-600" />

              <h3 className="font-bold text-slate-900">
                Community Guidelines
              </h3>
            </div>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• Be respectful and supportive.</li>
              <li>• Share accurate and helpful information.</li>
              <li>• Protect your personal information.</li>
              <li>• Keep discussions relevant to campus.</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-900 p-5 text-white">
            <h3 className="font-bold">Have something to share?</h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Your question or idea could help another student today.
            </p>

            <button
              type="button"
              onClick={() => setShowComposer(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-indigo-50"
            >
              <Plus size={17} />
              Write a Post
            </button>
          </div>
        </aside>
      </div>

      {/* Create post modal */}
      {showComposer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onClick={() => setShowComposer(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-post-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="create-post-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Create a Post
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Share something with your campus community.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowComposer(false)}
                aria-label="Close dialog"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Post Title *
                </label>

                <input
                  required
                  value={newPost.title}
                  onChange={(event) =>
                    setNewPost({
                      ...newPost,
                      title: event.target.value,
                    })
                  }
                  placeholder="Give your post a title"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={newPost.category}
                  onChange={(event) =>
                    setNewPost({
                      ...newPost,
                      category: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                >
                  <option value="Academic">Academic</option>
                  <option value="Announcement">Announcement</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  What's on your mind? *
                </label>

                <textarea
                  required
                  rows={5}
                  value={newPost.content}
                  onChange={(event) =>
                    setNewPost({
                      ...newPost,
                      content: event.target.value,
                    })
                  }
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                <Image size={17} />
                Image uploads can be added when backend storage is configured.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Send size={17} />
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampusFeed;

