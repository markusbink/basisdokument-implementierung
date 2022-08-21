import { Button } from "./Button";
import { SectionHeader } from "./SectionHeader";

export const Discussion = () => {
  return (
    <div className="bg-offWhite h-full overflow-y-scroll p-4 space-y-4">
      <div className="max-w-[1200px] m-auto flex flex-col gap-12">
        {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map((i) => (
          <section className="flex flex-col gap-6" key={i}>
            <SectionHeader
              sectionId={i}
              titlePlaintiff="Beschreibung zum Unfall als sehr sehr langer Titel"
              titleDefendant="Initialer Tathergang"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-lightPurple text-black p-4 border border-darkPurple rounded-lg">
                <h3>Beitrag Kläger</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Consequuntur dolorum earum dolores omnis odit, voluptas
                  ratione? Praesentium reprehenderit perspiciatis repudiandae
                  officia veniam qui facere at deserunt, harum ab pariatur
                  beatae?
                </p>
              </div>
              <div className="bg-lightPetrol text-black p-4 border border-darkPetrol rounded-lg">
                <h3>Beitrag Beklagter</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Consequuntur dolorum earum dolores omnis odit, voluptas
                  ratione? Praesentium reprehenderit perspiciatis repudiandae
                  officia veniam qui facere at deserunt, harum ab pariatur
                  beatae?
                </p>
              </div>
            </div>
          </section>
        ))}
        <div className="border-t-[1px] border-darkGrey mt-6 mb-3"></div>
        <div className="flex justify-end">
          <Button size="sm"> + &nbsp;&nbsp; Gliederungspunkt hinzufügen</Button>
        </div>
      </div>
    </div>
  );
};
