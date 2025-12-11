import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-6xl mb-4">404</CardTitle>
          <CardTitle>Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-6">
            Oops! This page doesn't exist.
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
