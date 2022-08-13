import { IEntry, UserRole } from "../types";
import { Entry } from "./entry";

const mockEntries: IEntry[] = [
  {
    id: "1f1f2fa4-13fa-11ed-861d-0242ac120002",
    version: 1,
    text: "Lorem Ipsum is simply <strong>dummy text</strong> of the printing and typesetting industry.",
    author: "Stefan Schneider",
    role: "Kläger",
    section_id: "d990191e-13fc-11ed-861d-0242ac120002",
  },
  {
    id: "257550a4-13fa-11ed-861d-0242ac120002",
    version: 2,
    text: "Lorem Ipsum has been the <i>industry's standard dummy text</i>ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    author: "Michael Bauer",
    role: "Beklagter",
    section_id: "d990191e-13fc-11ed-861d-0242ac120002",
    associated_entry: "1f1f2fa4-13fa-11ed-861d-0242ac120002",
  },
];

export const Discussion = () => {
  return (
    <div className="bg-offWhite h-full overflow-y-scroll p-4 space-y-4">
      <div className="max-w-[1200px] m-auto">
        <section className="space-y-8">
          <div className="text-xl font-bold">
            <span>1.</span> Gliederungspunkt
          </div>
          <div className="space-y-8">
            {mockEntries.map((entry, index) => (
              <Entry
                key={entry.id}
                entry={entry}
                isBookmarked={index % 2 === 0}
                isHidden={index % 2 === 0}
                viewedBy={UserRole.Defendant}
                isOld={index % 2 === 0}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
