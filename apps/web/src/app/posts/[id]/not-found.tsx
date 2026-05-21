import { Navbar } from "@components/navbar/Navbar";

export default function NotFound() {
    return (
        <>
        <Navbar />
        <main className="bg-surface min-h-screen flex items-center justify-center">
            <h1 className="font-serif font-normal text-xl text-on-surface mb-6 text-center">You might lost your way :/</h1>
        </main>
        </>
    );
}
