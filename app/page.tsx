import Container from "@/components/common/Container";
import Hero from "@/components/landing/Hero";
import Experience from "@/components/landing/Experience";
import About from "@/components/landing/About";
import Github from "@/components/landing/Github";

export default function Home() {
  return (
     <Container className="min-h-screen py-16">
      <Hero/>
      <Experience/>
      <About/>
      <Github/>
     </Container>
  );
}
