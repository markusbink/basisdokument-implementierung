import { OnboardingSliderItem } from "./OnboardingSwiperItem";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { ArrowSquareLeft, ArrowSquareRight } from "phosphor-react";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";

const sliderItems = [
  {
    src: "BDWelcome.png",
    alt: "Main screen to show the main functions",
    title: "Willkommen zum Basisdokument!",
    desc: "Das Basisdokument unterstützt die Digitalisierung ziviler Gerichtsverfahren. In dieser kurzen Einführung werden Ihnen die Funktionen des Basisdokuments erläutert.",
  },
  {
    src: "videos/BDAnlegen.mp4",
    title: "Basisdokument anlegen",
    desc: "Zu Beginn können Sie wählen, ob Sie ein neues Basisdokument erstellen oder ein bereits vorhandenes Basisdokument öffnen wollen. Zusätzlich können private Ergänzungen und Notizen geladen & gespeichert werden. Dazu dient die sogenannte “Bearbeitungsdatei”, welche automatisch heruntergeladen wird, sobald Sie das Basisdokument herunterladen. Beide Dateien werden mit der Endung .txt gespeichert.",
  },
  {
    src: "videos/BDMetadataThreading.mp4",
    title: "Basisdokument: Fall anlegen & Ansicht",
    desc: "Beim initialen Anlegen eines Falls können Sie Rubren Ihrer Mandant:innen eintragen. Diese werden in zwei gegenüberliegenden Spalten dargestellt - zur optimalen Übersicht finden Sie die Beiträge der Klagepartei stets in der linken, die der Beklagtenpartei stets in der rechten Spalte. Wenn Sie jedoch eine Zeilenansicht der Beiträge präferieren, können Sie ganz einfach wechseln. Keine Sorge, auch hier können Sie dank der Farbgebung eindeutig erkennen, welche Beiträge von welcher Partei verfasst wurden.",
  },
  {
    src: "videos/BDBeitragGliederungspunkt.mp4",
    title: "Basisdokument: Beiträge hinzufügen",
    desc: "Auf der Hauptseite der Anwendung können Sie neue Gliederungspunkte erstellen und über den Button „Beitrag hinzufügen“ einen neuen Beitrag hinzufügen - äquivalent zum Erstellen eines neuen Abschnitts, wie Sie es von Ihrem Texteditor kennen. Beiträge werden immer zu Gliederungspunkten hinzugefügt. Das Vergeben eines Titel für einen Gliederungspunkt ist dabei optional und kann von allen Parteien eingesehen werden.",
  },
  {
    src: "videos/BDBezugNehmen.mp4",
    title: "Basisdokument: Fall bearbeiten & Argumente hinzufügen",
    desc: "Als Vertreter:innen der Beklagten können Sie, um auf einen Beitrag der Gegenseite einzugehen und die Sicht Ihrer Mandant:innen darzustellen, im jeweiligen Abschnitt einen eigenen Beitrag über „auf diesen Beitrag Bezug nehmen“ hinzufügen. Bezüge auf Beiträge können Sie in der Zeilenansicht erkennen.",
  },
  {
    src: "videos/BDSichtbarkeit.mp4",
    title: "Sichtbarkeit von Beiträgen",
    desc: "Beiträge, die Sie hinzufügen, können die Gegenseite und die Richter:innen erst sehen, wenn Sie das exportierte Basisdokument an diese übermittelt haben. Die Anwendung übermittelt keine Daten an einen externen Server. Wenn Sie am Basisdokument arbeiten und in mehreren Sitzungen Beiträge hinzufügen, sind diese nur für Sie sichtbar. Wie Sie Ihren aktuellen Stand für die nächste Sitzung abzuspeichern, erklären wir Ihnen auf der nächsten Seite.",
  },
  {
    src: "videos/BDSpeichern.mp4",
    title: "Speichern",
    desc: "Sie können Ihre Version des Basisdokuments lokal speichern. Das ermöglicht Ihnen über mehrere Sitzungen hinweg, Beträge hinzuzufügen, zu bearbeiten und löschen. Öffnen Sie ein Basisdokument, an dem Sie weiterarbeiten möchten bzw. das noch nicht an die Gegenseite oder Richter:in übermittelt wurde, dann setzen Sie keinen Haken bei der Option einer neuen Version.",
  },
  {
    src: "videos/BDVersion.mp4",
    title: "Exportieren & Versenden",
    desc: "Wenn Sie ein Basisdokument öffnen, das Sie von einer anderen Seite erhalten haben, setzen Sie umbedingt einen Haken bei der Option “Ich möchte eine neue Version auf Basis der hochgeladenen Version erstellen.” Haben Sie die Bearbeitung Ihrer Version abgeschlossen, können Sie diese Expotieren und die Datei mit der Endung .pdf versenden.",
  },
  {
    src: "videos/BDSortierung.mp4",
    title: "Sortierung ",
    desc: "Gliederungspunkte können Sie anhand der Sortierfunktion in eine für Sie schlüssige Reihenfolge bringen, indem Sie über das Dropdown-Menü in der oberen Leiste die private Sortierung auswählen. Ihre eigens erstellte private Sortierung wird nur für Sie gespeichert.",
  },
  {
    src: "videos/BDMarkierungen.mp4",
    title: "Markierungen",
    desc: "Wichtige Textstellen im Basisdokument können Sie anhand der Markierfunktion hervorheben. Dafür kann in der oberen Leiste das Werkzeug “Markieren” sowie die Farbe hierfür ausgewählt werden. Diese Markierungen werden nur für Sie gespeichert. Das Basisdokument kann auch nach Markierungen gefiltert werden.",
  },
  {
    src: "videos/BDLesezeichen.mp4",
    title: "Lesezeichen",
    desc: "Zu Beiträgen im Basisdokument können Lesezeichen hinzugefügt werden, die nur für Sie gespeichert werden. In der Sidebar der Anwendung können Sie auf alle Lesezeichen zugreifen. Ein Klick auf die Beitrags-ID bringt Sie direkt zum Beitrag, zu dem das jeweilige Lesezeichen hinzugefügt wurde.",
  },
  {
    src: "videos/BDNotizen.mp4",
    title: "Notizen",
    desc: "Das Basisdokument erlaubt das Anlegen privater Notizen, die nur für Sie gespeichert werden. Eine Notiz kann optional auch auf einen Beitrag verweisen. Auch hier ist es möglich, durch einen Klick auf die Beitrags-ID zu dem Beitrag zu gelangen, auf den sich die Notiz bezieht.",
  },
  {
    src: "videos/BDHinweise.mp4",
    title: "Hinweise der Richter:innen nach §139 ZPO",
    desc: "Richter:innen können Hinweise an die beiden Parteien verfassen. Ähnlich wie bei den Notizen, ist es auch hier möglich, dass sich ein Hinweis der Richter:innen auf einen bestimmten Beitrag bezieht. Zusätzlich können Richter:innen Beiträge als „streitig“ und „unstreitig“ kennzeichnen. Dies kann über das farbliche Icon an den Beiträgen erkannt werden.",
  },
  {
    src: "videos/BDHelp.mp4",
    title: "Viel Erfolg bei der Bearbeitung Ihres Falles!",
    desc: "Sollte Ihnen später etwas unklar sein, können Sie jederzeit über das Hilfe-Icon zu diesem Guide zurückkehren.",
  },
];
const SwiperButtonNext = () => {
  const swiper = useSwiper();
  return (
    <button
      className="nextEl mx-16 select-all w-10 h-10"
      onClick={() => swiper.slideNext()}>
      <ArrowSquareRight
        size={42}
        className="text-darkGrey hover:text-mediumGrey"
        weight="fill"
      />
    </button>
  );
};

const SwiperButtonPrev = () => {
  const swiper = useSwiper();
  return (
    <button
      className="prevEl mx-16 select-all w-10 h-10"
      onClick={() => swiper.slidePrev()}>
      <ArrowSquareLeft
        size={42}
        className="text-darkGrey hover:text-mediumGrey"
        weight="fill"
      />
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
        pagination={{ clickable: true, dynamicBullets: true }}
        className={"rounded-xl space-y-4"}>
        {sliderItems.map((sliderItem, index) => (
          <div className="swiper-wrapper">
            <SwiperSlide key={index}>
              <OnboardingSliderItem
                src={sliderItem.src}
                alt={sliderItem.alt}
                title={sliderItem.title}
                desc={sliderItem.desc}
              />
            </SwiperSlide>
          </div>
        ))}
        <div className="relative flex mx-10 justify-center">
          <SwiperButtonPrev />
          <SwiperButtonNext />
        </div>
      </Swiper>
    </>
  );
};
