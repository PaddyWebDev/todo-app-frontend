"use client"
import { useRouter } from "next/navigation";
import Navbar from "./(frontend)/auth/components/navbar";

export default function Home() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 w-full">
      <Navbar />

      {/* Hero Section */}
      <section className="flex items-center text-center justify-center h-[97dvh]">

        <div>
          <h2 className="text-4xl md:text-5xl font-bold  text-neutral-900 dark:text-neutral-100">
            Welcome to <span className="text-neutral-700 dark:text-neutral-300">MyApp</span>
          </h2>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A simple app to manage your notes, todos, and stay productive — built with Next.js, Prisma, and PostgreSQL.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={() => router.push('/guest/Register')} className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
              Get Started
            </button>
            <button onClick={() => router.push('/guest/Login')} className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
              Already Registered
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <h4 className="text-xl font-bold mb-2">Notes</h4>
              <p className="text-neutral-600 dark:text-neutral-400">Organize your thoughts in one place.</p>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <h4 className="text-xl font-bold mb-2">Todos</h4>
              <p className="text-neutral-600 dark:text-neutral-400">Track tasks with deadlines and priorities.</p>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <h4 className="text-xl font-bold mb-2">Secure Auth</h4>
              <p className="text-neutral-600 dark:text-neutral-400">Safe login with email verification and reset.</p>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="px-8 py-6 border-t border-neutral-200 dark:border-neutral-700 text-center text-neutral-600 dark:text-neutral-400">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </main>
  );
}
