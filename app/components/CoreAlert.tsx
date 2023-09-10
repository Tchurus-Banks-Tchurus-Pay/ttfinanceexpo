import React, { Component, ReactNode } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CoreAlertProps {
  children: ReactNode;
}

class CoreAlert extends Component<CoreAlertProps> {
  state = {
    isVisible: false,
    message: "",
  };

  showPopup = (message: string) => {
    this.setState({ isVisible: true, message });
  };

  closePopup = () => {
    this.setState({ isVisible: false, message: "" });
  };

  render() {
    return (
      <View>
        {this.props.children}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isVisible}
          onRequestClose={this.closePopup}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{this.state.message}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={this.closePopup}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontFamily: "Poppins",
  },
});

export default CoreAlert;
