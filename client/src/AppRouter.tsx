import {
    ClerkProvider,
    SignedIn,
    SignedOut,
    RedirectToSignIn,
    SignIn,
    SignUp,
} from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Home from "./pages/Home";

const clerkPubKey = import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
    throw new Error("Missing Publishable Key");
}

const AppRouter = () => {

    return (
        <BrowserRouter>
            <ClerkProvider
                publishableKey={clerkPubKey}
            >
                <Routes>
                    <Route index element={<Home />} />
                    <Route
                        path="/sign-in/*"
                        element={<SignIn routing="path" path="/sign-in" />}
                    />
                    <Route
                        path="/sign-up/*"
                        element={<SignUp routing="path" path="/sign-up" />}
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <>
                                <SignedIn>
                                    <Dashboard />
                                </SignedIn>
                                <SignedOut>
                                    <RedirectToSignIn />
                                </SignedOut>
                            </>
                        }
                    />
                    <Route
                        path="/document/:documentId"
                        element={
                            <>
                                <SignedIn>
                                    <Editor />
                                </SignedIn>
                                <SignedOut>
                                    <RedirectToSignIn />
                                </SignedOut>
                            </>
                        }
                    />
                </Routes>
            </ClerkProvider>
        </BrowserRouter>

    );
};

export default AppRouter;