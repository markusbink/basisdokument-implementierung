import { Button } from "./Button";
import { DotsThree, CaretUp, CaretDown } from "phosphor-react"

export const Discussion = () => {
  return (
    <div className="bg-offWhite h-full overflow-y-scroll p-4 space-y-4">
      <div className="max-w-[1200px] m-auto">
        {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map((i) => (
          <section key={i}>
            <div className="text-xl font-bold grid grid-cols-10 w-1/2 place-items-center">
              <div className="col-start-1 col-end-2 scale-75">
                  <Button
                      bgColor="bg-lightGrey"
                      textColor="darkGrey"
                      size="sm"
                      icon={<CaretUp size={18} />}
                  />
                  <Button
                      bgColor="bg-lightGrey"
                      textColor="darkGrey"
                      size="sm"
                      icon={<CaretDown size={18} />}
                  />
              </div>
              <div className="bg-darkGrey box-border w-10 h-10 p-4 rounded-lg rotate-45 col-start-2 col-end-3">
              <span className="text-white" >{i}</span>
              </div> 
              <p className="">Gliederungspunkt</p>
              <div className="">
                <Button 
                  icon={<DotsThree size={18} />}
                  bgColor="offwhite"
                  textColor="lightGrey"
                />
              </div>
            </div>
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
          <Button size="sm"
            > + &nbsp;&nbsp; Gliederungspunkt hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
};
