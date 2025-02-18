import ButtonLogin from "@/components/buttonlogin";

export default function Home() {
  const name = "Victor";
  const isLoggedIn = true;
  return (
    <main>
      <section className="text-center px-8 py-32 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold">
          Collect customer feedback you build better products
        </h1>
        <div className="opacity-90 mb-10">
          Create a feedback board in minutes, prioritize features, and build
          products y our customers will love.
        </div>
      </section>

      <ButtonLogin isLoggedIn={isLoggedIn} name={name} />
    </main>
  );
}
