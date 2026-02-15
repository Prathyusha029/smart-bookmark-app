"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

interface Bookmark {
  id: string
  title: string
  url: string
}

export default function Dashboard() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/login")
      }
    }
    checkUser()
  }, [])

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    console.log("Fetched:", data)
    console.log("Error:", error)

    setBookmarks(data || [])
  }

  useEffect(() => {
  fetchBookmarks()

  const channel = supabase
    .channel("realtime-bookmarks")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "bookmarks",
      },
      () => {
        fetchBookmarks()
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "bookmarks",
      },
      () => {
        fetchBookmarks()
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "bookmarks",
      },
      () => {
        fetchBookmarks()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])

  const addBookmark = async () => {
  if (!title || !url) {
    alert("Please fill all fields")
    return
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  console.log("Current User:", user)

  if (userError || !user) {
    alert("User not authenticated")
    console.log("User error:", userError)
    return
  }

  const { data, error } = await supabase.from("bookmarks").insert([
    {
      title: title,
      url: url,
      user_id: user.id,
    },
  ])

  console.log("Insert Data:", data)
  console.log("Insert Error:", error)
if (error) {
  if (error.code === "23505") {
    alert("You already saved this bookmark!")
  } else {
    alert("Insert failed")
  }
  return
}


  setTitle("")
  setUrl("")
  fetchBookmarks()
}


  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)

    if (error) {
      console.log("Delete error:", error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={addBookmark}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul>
        {bookmarks.map((b) => (
          <li
            key={b.id}
            className="flex justify-between items-center mb-2 border p-2 rounded"
          >
            <a
  href={b.url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline"
>

              {b.title}
            </a>
            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
