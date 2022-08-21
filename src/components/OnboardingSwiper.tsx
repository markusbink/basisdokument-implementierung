import { OnboardingSliderItem } from "./OnboardingSwiperItem";
import { Navigation, Pagination } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";


export const OnboardingSwiper = () => {


  const sliderItems = [
    {
      imageSrc: "/mainscreenBD.png",
      imageAlt: "Main screen to show the main functions",
      title: "Willkommen zum Basisdokument!",
      desc: "Das Basisdokument ist zur Digitalisierung ziviler Gerichtsverfahren. In dieser kurzen EInführung möchten wir Ihnen die Funktionen des Basisdokuments erklären. ",
    },
    {
      imageSrc: "/mainscreenBD.png",
      imageAlt: "blabla",
      title: "Basisdokument anlegen",
      desc: "Zu Beginn können Sie wählen: ein neues Basisdokument anlegen oder eine bereits vorhandene Datei zu öffnen. Ein Basisdokument besteht immer aus zwei Dateien, **sollen wir das hier erklären? verwirrt das?**",
    },
    {
      imageSrc: "/mainscreenBD.png",
      imageAlt: "blabla",
      title: "Basisdokument: Fall anlegen",
      desc: "Legen Sie ganz einfach ein Basisdokument an: Metadaten werden in einer Übersicht dargestellt, Beiträge werden ganz einfach hinzugefügt. Für eine optimale Übersicht ist die Klagepartei stets in der linken Spalte, die Beklatenpartei stets in der rechten Spalte dargestellt. Auf bereits vorhandene Beiträge können Sie einfach antworten um die Sicht ihres:r Mandantens:in der Argumente darzustellen.",
    },
    {
      imageSrc: "/mainscreenBD.png",
      imageAlt: "blabla",
      title: "Sidebar",
      desc: "In der Sidebar können Sie privaten Notizen zu Beträgen und Lesezeichen anlegen. Dort finden Sie zusätzlich Hinweise von Richter:innen. Private Notizen und Lesezeichen können nur von Ihnen eingesehen werden. Ein Klick auf die BeitragsID bringt Sie direkt zum jeweiligen Beitrag.",
    },
    {
      imageSrc: "/mainscreenBD.png",
      imageAlt: "blibla",
      title: "Speichern & Versenden",
      desc: "Sie können Ihre Version des Basisdokuments lokal speichern. Das ermöglicht Ihnen über mehrere Sitzngen hinweg Beträge hinzuzufügen. Ist Ihre aktuelle Version des Basisdokuments abgeschlossen und dieses soll an den/die Richter:in weitergegeben werden können Sie dieses exportieren. Ab dem Export können Sie keine Beiträge mehr bearbeiten, beim bloßigen Speichern ist das weiterhin möglich.",
    },
    {
      imageSrc: "/mainscreenBD.png",
      imageAlt: "blibla",
      title: "TODO:Onboarding Themen besprechen",
      desc: "Die Themen für das Onboarding sollten wir nochmal besprechen!!",
    }

  ]

  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination]}
      slidesPerView={1}
      navigation
      centeredSlides={true}
      loop={false}
      setWrapperSize={true}
      pagination={{ clickable: true, dynamicBullets: true }}
    >
      {sliderItems.map((sliderItem) => <SwiperSlide> <OnboardingSliderItem imageSrc={sliderItem.imageSrc} imageAlt={sliderItem.imageAlt} title={sliderItem.title} desc={sliderItem.desc} /> </SwiperSlide>)}
    </Swiper>
  );
};