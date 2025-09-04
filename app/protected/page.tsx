import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Fetch user profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url, full_name')
    .eq('id', data.claims.sub)
    .single();

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-12 max-w-5xl p-5">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <Link href="/" className="font-semibold">
              My App
            </Link>
            <LogoutButton />
          </div>
        </nav>
        
        <div className="flex-1 flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Protected Page</h1>
            <p className="text-lg text-muted-foreground">
              Welcome! You are now signed in.
            </p>
          </div>
          
          {/* Profile Section */}
          <div className="bg-accent p-6 rounded-lg">
            <h2 className="font-bold text-xl mb-4">Your Profile</h2>
            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <p><strong>Email:</strong> {data.claims.email}</p>
                <p><strong>Full Name:</strong> {profile?.full_name || 'Not set'}</p>
                <p><strong>User ID:</strong> {data.claims.sub}</p>
                <p><strong>Signed up:</strong> {new Date(data.claims.iat * 1000).toLocaleDateString()}</p>
                {profile?.avatar_url && (
                  <p className="text-green-600 text-sm">✓ Profile picture uploaded</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/" 
              className="text-blue-600 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
