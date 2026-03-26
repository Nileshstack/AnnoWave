"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner";

type User = {
  username: string
}

export default function PublicProfilesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true);
 
  const router = useRouter();
  const session= useSession();
  
  if(session.status==="unauthenticated"){
    router.replace("/sign-in")
  }
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/get-username")
        const data = await res.json()
        
        if (data.success) {
          const Users = data.usernames.map((username: string) => ({
            username,
          }))
          setUsers(Users)
          setLoading(false);
          toast.success("Send Ananymous messages to public profiles");
        }
      } catch (err) {
        setLoading(false);
        toast.error("Failed to fetch users");
      }
    }

    fetchUsers()
  }, [])
  //to make base url
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
//to filetr the username on the baisi of search
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white px-4 py-10">
       <div className="max-w-2xl mx-auto space-y-8">

        <div className="space-y-3">
          <Badge
            variant="outline"
            className="text-gray-400 border-gray-200 bg-gray-50 text-xs tracking-widest uppercase"
          >
            Anonwave
          </Badge>

          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Public Profiles
            </h1>
            <p className="text-gray-700 text-sm">
              Open any profile and send an anonymous message.
            </p>
          </div>

          <Separator className="bg-gray-100" />
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {loading ? (
           <div className="text-center py-16 space-y-2">
              <p className="text-gray-400 text-sm font-mono">— Loading Public Profiles —</p>
              <p className="text-gray-300 text-xs">Wait for a while...</p>
            </div>
          ) :(
          filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <Card key={index}>
                <CardContent className="flex items-center justify-between p-4">

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold">@{user.username}</p>
                      <p className="text-sm text-gray-600">
                        {`${baseUrl}/Anonwave/${user.username}`}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      window.open(`${baseUrl}/Anonwave/${user.username}`, "_blank")
                    }
                  >
                    Open
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16 space-y-2">
              <p className="text-gray-400 text-sm font-mono">— no profiles found —</p>
              <p className="text-gray-300 text-xs">Try a different search term</p>
            </div>
          ))}
          
        </div>
      </div>
    </div>
  )
}