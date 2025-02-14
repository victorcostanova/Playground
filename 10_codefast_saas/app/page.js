import ButtonLogin from "@/components/buttonlogin";

export default function Home() {
  const name = "Victor";
  const isLoggedIn = true;
  return (
    <main>
      <h1>Collect customer feedback yo build better products</h1>
      <div>
        Create a feedback board in minutes, prioritize features, and build
        products your customers will love.
      </div>

      <ButtonLogin isLoggedIn={isLoggedIn} name={name} />
    </main>
  );
}
