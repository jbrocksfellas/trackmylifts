import Link from "next/link";

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hey Lifters</h1>
          <p className="py-6">
            When the weights get heavy, it's easy to doubt yourself and feel discouraged. But it's in those moments that you need to push through and find the
            mental strength to keep going. Trust in yourself and your abilities, and know that with each repetition and set, you are getting stronger and closer
            to your goals.
            <br />
            <br />
            The discipline and perseverance you show in the gym can carry over into other areas of your life. You are proving to yourself that you have what it
            takes to overcome challenges and achieve success. Keep up the hard work, and remember that you are capable of achieving anything you set your mind
            to.
          </p>
          <Link href="/login" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </div>
  );
}
