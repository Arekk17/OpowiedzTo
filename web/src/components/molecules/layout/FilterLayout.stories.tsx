import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { FilterLayout } from "./FilterLayout";
import { RadioField } from "../forms/RadioField";
import { Tag } from "../../atoms/tags/Tag";

const meta: Meta<typeof FilterLayout> = {
  title: "Molecules/Layout/FilterLayout",
  component: FilterLayout,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
    },
    variant: {
      control: "select",
      options: ["column", "row"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "",
  },

  render: () => {
    const [selected, setSelected] = useState("newest");
    return (
      <FilterLayout title="Popularność">
        <RadioField
          name="popularity"
          value="newest"
          label="Najnowsze"
          checked={selected === "newest"}
          onChange={() => setSelected("newest")}
        />
        <RadioField
          name="popularity"
          value="most-popular"
          label="Najpopularniejsze"
          checked={selected === "most-popular"}
          onChange={() => setSelected("most-popular")}
        />
        <RadioField
          name="popularity"
          value="most-commented"
          label="Najbardziej komentowane"
          checked={selected === "most-commented"}
          onChange={() => setSelected("most-commented")}
        />
      </FilterLayout>
    );
  },
};

export const WithCustomTitle: Story = {
  render: () => {
    const [selected, setSelected] = useState("all");
    return (
      <FilterLayout title="Kategoria">
        <RadioField
          name="category"
          value="all"
          label="Wszystkie"
          checked={selected === "all"}
          onChange={() => setSelected("all")}
        />
        <RadioField
          name="category"
          value="love"
          label="Miłość"
          checked={selected === "love"}
          onChange={() => setSelected("love")}
        />
        <RadioField
          name="category"
          value="adventure"
          label="Przygoda"
          checked={selected === "adventure"}
          onChange={() => setSelected("adventure")}
        />
      </FilterLayout>
    );
  },
};

export const RowVariant: Story = {
  args: {
    title: "Filtry",
    variant: "row",
    children: (
      <>
        <Tag label="Miłość" />
        <Tag label="Zdrada" />
        <Tag label="Przygoda" />
        <Tag label="Dramat" />
        <Tag label="Komedia" />
      </>
    ),
  },
};
