import styled from "styled-components";

const Button = styled.button`
  background-color: #3A4342;
  color: white;
  padding: 7px 13px;
  border-radius: 8px;
  outline: 0;
  box-shadow: 0px 2px 2px darkGrey;
`

export const Discussion = () => {
  return (
    <div className="bg-offWhite h-full overflow-y-scroll p-4 space-y-4">
      <div className="max-w-[1200px] m-auto">
        {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map((i) => (
          <section key={i}>
            <div className="text-xl font-bold">
              <span>{i}.</span> Gliederungspunkt
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
        <div style={{ borderTop: "1px solid darkGrey ", marginTop: 25, marginBottom: 15}}></div>
        <div className="flex justify-end">
          <Button className="text-sm" 
            > + &nbsp;&nbsp; Gliederungspunkt hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
};
