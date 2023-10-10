import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";
import { UIColors } from "../constants/Colors";
import { supabase } from "../constants/Supabase";
import UIText from "./UIText";

interface User {
  id: number;
  name: string;
}

interface SearchUsernameDropdownProps {
  labelText: string;
  onUsernameSelect: (username: string) => void;
}

const SearchUsernameDropdown: React.FC<SearchUsernameDropdownProps> = ({
  labelText,
  onUsernameSelect,
}) => {
  const [query, setQuery] = useState<string>("");
  const [usernames, setUsernames] = useState<User[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<TAutocompleteDropdownItem | null>(null);
  var localUsernames: User[] = [];

  const searchUsernames = async (query: string) => {
    if (query == undefined) return;

    if (query === "") {
      localUsernames = [];
      setUsernames([]);
      return;
    }

    if (query.length == 1) {
      console.log("ihhhh");
      const { data, error } = await supabase
        .from("profiles")
        .select("username, id")
        .filter("username", "ilike", `%${query}%`);

      if (error) {
        console.log(error);
      } else {
        const filteredUsernames = data?.map((user) => ({
          id: user.id,
          name: user.username,
        }));

        console.log(filteredUsernames);
        setUsernames(filteredUsernames!);
        localUsernames = filteredUsernames!;
        return;
      }
    }

    const filteredUsernames = localUsernames.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  useEffect(() => {
    searchUsernames(query);
  }, [query]);

  const handleUsernameSelect = (username: string) => {
    setQuery(username);
    onUsernameSelect(username);
  };

  const onClearPress = useCallback(() => {
    localUsernames = [];
    setUsernames([]);
    setSelectedItem(null);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{labelText}</Text>
      <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        onChangeText={setQuery}
        initialValue={query}
        onSelectItem={(item) => {
          item && setSelectedItem(item);
          console.log(item);
          handleUsernameSelect(item?.title!);
        }}
        dataSet={usernames.map((user) => ({
          id: user.id.toString(),
          title: user.name,
        }))}
        textInputProps={{
          placeholder: "Pesquise o usuário",
          placeholderTextColor: "#727272",
          autoCorrect: false,
          autoCapitalize: "none",
          style: {
            color: "#fff",
          },
        }}
        onClear={onClearPress}
        suggestionsListContainerStyle={{
          backgroundColor: "#44475c",
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#44475c",
        }}
        emptyResultText="Nenhum usuário encontrado"
        inputContainerStyle={{
          backgroundColor: "#282a36",
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#44475c",
        }}
        EmptyResultComponent={
          <UIText style={{ color: "#fff", padding: 15 }}>
            Usuário não encontrado!
          </UIText>
        }
        renderItem={(item, text) => (
          <Text style={{ color: "#fff", padding: 15 }}>{item.title}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
    width: 350,
  },
  label: {
    fontSize: 18,
    color: UIColors.primaryText,
    marginBottom: 8,
    fontFamily: "Poppins",
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: UIColors.primaryBorderColor,
  },
  dropdownText: {
    color: UIColors.primaryText,
    fontFamily: "Poppins",
    fontSize: 16,
  },
});

export default SearchUsernameDropdown;
