import { OnboardingSliderItem } from "./OnboardingSwiperItem";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { ArrowSquareLeft, ArrowSquareRight } from "phosphor-react";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";

const sliderItems = [
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "Main screen to show the main functions",
    title: "Willkommen zum Basisdokument!",
    desc: "Das Basisdokument unterstützt die Digitalisierung ziviler Gerichtsverfahren. In dieser kurzen Einführung werden Ihnen die Funktionen des Basisdokuments erläutert.",
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "blabla",
    title: "Basisdokument anlegen",
    desc: "Zu Beginn können Sie wählen, ob Sie ein neues Basisdokument erstellen oder eine bereits vorhandenes Basisdokument öffnen wollen. Zusätzlich können private Ergänzungen und Notizen geladen & gespeichert werden. Dazu dient die sogenannte “Bearbeitungsdatei”, welche automatisch heruntergeladen wird, sobald Sie das Basisdokument herunterladen. Beide Dateien werden mit der Endung .json gespeichert.",
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "blabla",
    title: "Basisdokument: Fall anlegen & Ansicht",
    desc: "Beim initialen Anlegen eines Falls können Sie Metadaten Ihrer Mandant:innen eintragen. Die Ansicht der Beiträge können Sie zwischen einer Spalten- und einer Zeilenansicht wechseln, ganz nach Ihren Präferenzen. Für eine optimale Übersicht ist die Klagepartei stets in der linken Spalte, die Beklagtenpartei stets in der rechten Spalte dargestellt.",
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "blabla",
    title: "Basisdokument: Beiträge hinzufügen",
    desc: "Auf der Hauptseite der Anwendung können Sie über „Beitrag hinzufügen“ einen neuen Klagepunkt hinzufügen. Beiträge werden immer zu Gliederungspunkten hinzugefügt. Ein Titel für einen Gliederungspunkt ist dabei optional und kann von allen Parteien eingesehen werden.",
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "blabla",
    title: "Basisdokument: Fall bearbeiten & Argumente hinzufügen",
    desc: "Als Vertreter:innen der Beklagten können Sie, um auf einen Beitrag einzugehen und die Sicht Ihrer Mandant:innen darzustellen, im jeweiligen Abschnitt einen eigenen Beitrag über „Text verfassen“ hinzufügen.",
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "blibla",
    title: "Sichtbarkeit von Beiträgen",
    desc: "Beiträge, die Sie hinzufügen, können die Gegenseite und der Richter erst sehen, wenn Sie das exportierte Basisdokument an diese übermittelt haben. Wenn Sie am Basisdokument arbeiten und in mehreren Sitzungen Beiträge hinzufügen, sind diese nur für Sie sichtbar. Die Anwendung übermittelt keine Daten an einen externen Server.",
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "blibla",
    title: "Speichern",
    desc:"Sie können Ihre Version des Basisdokuments lokal speichern. Das ermöglicht Ihnen über mehrere Sitzungen hinweg Beträge hinzuzufügen, zu bearbeiten und löschen. Öffnen Sie ein Basisdokument, an dem Sie weiterarbeiten möchten, bzw. das noch nicht an eine andere Seite übermittelt wurde, dann setzen Sie keinen Haken bei der Option einer neuen Version.", 
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "blibla",
    title: "Exportieren & Versenden",
    desc:"Öffnen Sie ein Basisdokument, das Sie von einer anderen Seite erhalten haben, ist es wichtig, dass Sie einen Haken setzen bei der Option “Ich möchte eine neue Version auf Basis der hochgeladenen Version erstellen.” Haben Sie Ihre Version abgeschlossen, können Sie diese Expotieren und die Datei mit der Endung .pdf versenden.", 
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "blibla",
    title: "Sortierung ",
    desc: "Gliederungspunkte können Sie anhand der Sortierfunktion in eine für Sie schlüssige Reihenfolge bringen, indem Sie über das Dropdown Menü der Top-Bar die private Sortierung auswählen. Ihre eigens erstelle private Sortierung wird nur für Sie gespeichert.",
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "blibla",
    title: "Markierungen",
    desc: "Wichtige Textstellen im Basisdokument können Sie anhand der Markierfunktion hervorheben. Dafür kann in der Top-Bar als Werkzeug “Markieren” sowie die Farbe, die Sie zum Markieren verwenden möchten, ausgewählt werden. Diese Markierungen werden nur für Sie gespeichert.",
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "blibla",
    title: "Lesezeichen",
    desc: "Zu Beiträgen im Basisdokument können Lesezeichen hinzugefügt werden, die nur für Sie gespeichert werden. In der Sidebar der Anwendung können Sie auf alle Lesezeichen zugreifen. Ein Klick auf die Beitrags-ID bringt Sie direkt zum Beitrag, zu dem das jeweilige Lesezeichen hinzugefügt wurde.",
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "bla",
    title: "Notizen",
    desc: "Das Basisdokument erlaubt das Anlegen privater Notizen, die nur für Sie gespeichert werden. Eine Notiz kann optional auch auf einen Beitrag verweisen. Auch hier ist es möglich, durch einen Klick auf die Beitrags-ID zu dem Beitrag zu gelangen, auf den sich die Notiz bezieht.",
  },
  {
    imageSrc: "mainscreenBD.png",
    imageAlt: "bla",
    title: "Hinweise des Richters nach §139 ZPO",
    desc: "Richter können Hinweise an die beiden Parteien verfassen. Ähnlich wie bei den Notizen, ist es auch hier möglich, dass sich ein Hinweis des Richters auf einen bestimmten Beitrag bezieht. Zusätzlich können Richter Beiträge als „streitig“ und „unstreitig“ kennzeichnen. Dies kann über das farbliche Icon an den Beiträgen erkannt werden.",
  },
];
const SwiperButtonNext = () => {
  const swiper = useSwiper();
  return (
    <button
      className="nextEl mx-16 select-all w-10 h-10"
      onClick={() => swiper.slideNext()}
    >
      <ArrowSquareRight size={42} className="fill-darkGrey" weight="fill" />
    </button>
  );
};

const SwiperButtonPrev = () => {
  const swiper = useSwiper();
  return (
    <button
      className="prevEl mx-16 select-all w-10 h-10"
      onClick={() => swiper.slidePrev()}
    >
      <ArrowSquareLeft size={42} className="fill-darkGrey" weight="fill" />
    </button>
  );
};

export const OnboardingSwiper = () => {
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        navigation={{ nextEl: "nextEL", prevEl: "prevEl" }}
        centeredSlides={true}
        loop={false}
        setWrapperSize={true}
        pagination={{ clickable: true, dynamicBullets:true}}
        className={"rounded-xl space-y-12"}
      >
        {sliderItems.map((sliderItem, index) => (
          <SwiperSlide key={index}>
            <OnboardingSliderItem
              imageSrc={sliderItem.imageSrc}
              imageAlt={sliderItem.imageAlt}
              title={sliderItem.title}
              desc={sliderItem.desc}
            />
          </SwiperSlide>
        ))}
        <div className="relative flex mx-10 justify-center">
          <SwiperButtonPrev />
          <SwiperButtonNext />
        </div>
      </Swiper>
    </>
  );
};