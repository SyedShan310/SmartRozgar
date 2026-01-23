import Footer from "../../components/common/footer"
import Navbar from "../../components/common/Navbar"
import { WavyBackground } from "../../components/common/WavyBackground"
import HeroSection from "../../components/HeroSections"
import ClientReviews from "../../components/home/ClientReview"
import ComplaintBox from "../../components/home/ComplaintBox"
import Services from "../../components/home/Services"
import TrendingServicesSection from "../../components/home/TrendingService"
import WhyChooseUs from "../../components/home/WhyChooseUs"
import Working from "../../components/home/Working"

const Home = () => {
  return (
    <>
   <Navbar/>
    <HeroSection/>
    <Services/>
    <TrendingServicesSection/>
    <WhyChooseUs/>
    <ClientReviews/>
   <Working/>
      <ComplaintBox/>

   <Footer/>
    
    </>
    
  )
}

export default Home