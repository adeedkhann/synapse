"use client"
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client"

const SignInPage = () => {
  return (
   <section className="min-h-screen flex items-center justify-center bg-background px-4">
  <Card className="w-full max-w-md">
    <CardContent className="pt-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back
        </h1>

        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline"
          >
            Sign up for free
          </Link>
        </p>
      </div>

      <form
        className="mt-8 space-y-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="space-y-2">
          <Label htmlFor="email">
            Email address
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
         <div className="flex items-center space-x-2">
  <Checkbox id="remember" />
  <Label htmlFor="remember">
    Remember me
  </Label>
</div>

          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
        >
          Sign in
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => {
          authClient.signIn.social({
            provider: "github",
            callbackURL: "/",
          });
        }}
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504..."
            clipRule="evenodd"
          />
        </svg>

        Sign in with GitHub
      </Button>
    </CardContent>
  </Card>
</section>
  )
}

export default SignInPage