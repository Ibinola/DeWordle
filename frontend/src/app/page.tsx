import Learning from "@/components/landing-page/learning";
import ExploreGames from "@/components/landing-page/explore-games";
import Footer from "@/components/landing-page/footer";
import GameEngagement from "@/components/landing-page/game-engagement";
import SlideScale from "@/components/landing-page/slide-scale";
import Hero from "@/components/landing-page/hero";

const Home = () => {
  return (
    <main className="flex flex-col relative w-full bg-primary-950  min-h-screen h-full overflow-x-hidden">
      <Hero />
      <section id="learning-section">
        <Learning />
      </section>
      <div className="flex flex-col w-full gap-[124px]">
        <ExploreGames />
        <SlideScale />
        <GameEngagement />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
