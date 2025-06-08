import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Blog = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Latest Insights</h1>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="text-blue-400 text-sm mb-2">{post.category}</div>
                  <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                  <p className="text-gray-400 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <a href="#" className="text-blue-400 hover:text-blue-300">Read More →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const blogPosts = [
  {
    title: "The Future of AI in Business Automation",
    excerpt: "Explore how artificial intelligence is revolutionizing business processes and what it means for your company.",
    category: "AI & Automation",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800",
  },
  {
    title: "Maximizing Efficiency with Smart Workflows",
    excerpt: "Learn how intelligent workflow automation can streamline your operations and boost productivity.",
    category: "Productivity",
    date: "March 10, 2024",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800",
  },
  {
    title: "Digital Transformation Success Stories",
    excerpt: "Real-world examples of companies that have successfully implemented automation solutions.",
    category: "Case Studies",
    date: "March 5, 2024",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800",
  },
];

export default Blog;