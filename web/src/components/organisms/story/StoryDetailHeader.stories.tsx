import type { Meta, StoryObj } from "@storybook/nextjs";
import { StoryDetailHeader } from "./StoryDetailHeader";

const meta: Meta<typeof StoryDetailHeader> = {
  title: "Organisms/Story/StoryDetailHeader",
  component: StoryDetailHeader,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof StoryDetailHeader>;

export const Default: Story = {
  args: {
    title: "Sekretne spotkanie",
    content:
      "To wydarzyło się kilka lat temu, kiedy byłam na studiach. Poznałam Michała na imprezie u znajomych. Od razu poczuliśmy do siebie miętę, ale oboje byliśmy w związkach. Zaczęliśmy pisać do siebie anonimowo, dzieląc się sekretami i marzeniami. Po kilku tygodniach postanowiliśmy się spotkać, nie mówiąc sobie, kim jesteśmy. Spotkanie było magiczne, ale po nim oboje zdecydowaliśmy, że to koniec. Do dziś nie wiem, kim był Michał, ale zawsze będę pamiętać to spotkanie.",
    tags: ["Sekret", "Miłość", "Studia"],
    publishedDate: "15 maja 2024",
    author: "Anonimowy",
    imageSrc:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=928&h=218&fit=crop",
    imageAlt: "Romantyczne spotkanie",
  },
};

export const WithoutImage: Story = {
  args: {
    title: "Historia bez obrazka",
    content:
      "Czasami najlepsze historie nie potrzebują obrazków, by poruszać nasze serca i wyobraźnię.",
    tags: ["Refleksja", "Życie"],
    publishedDate: "16 maja 2024",
    author: "Anonim",
  },
};

export const LongContent: Story = {
  args: {
    title: "Bardzo długa historia z wieloma szczegółami",
    content:
      "To jest bardzo długa historia, która pokazuje jak komponent radzi sobie z większą ilością tekstu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    tags: ["Długa", "Historia", "Test", "Lorem", "Ipsum"],
    publishedDate: "17 maja 2024",
    author: "Testowy Użytkownik",
    imageSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=928&h=218&fit=crop",
  },
};
