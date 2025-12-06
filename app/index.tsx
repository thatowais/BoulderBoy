import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Switch, SafeAreaView, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function ClimbingChallengeGenerator() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [slotVisibility, setSlotVisibility] = useState([false, false, false]);

  const defaultLists = {
    holds: [
      "JUGS", "SLOPERS", "CRIMPS", "VOLUMES",
      "POCKETS", "PINCHES", "SIDEPULLS", "UNDERCLINGS",
      "FOOTHOLDS"
    ],
    movements: [
      "HEEL HOOK", "TOE HOOK", "FLAGGING", "CAMPUS",
      "STATIC ONLY", "DYNO", "SMEAR", "BICYCLE",
      "MATCH HANDS", "TRAVERSE ONLY", "FIGURE FOUR", "CROUCH START"
    ],
    constraints: [
      "MAX 3 POINTS OF CONTACT", "ONE HAND BEHIND", "NO MATCHING",
      "30-SEC TIMER", "COLOR HOLDS ONLY", "NO LOOKING DOWN",
      "HOLD 3 SEC", "ELIMINATE ONE", "ONLY ONE FOOT",
      "SING WITHOUT PAUSE", "NO BREATHING", "CRAB WALK"
    ]
  };

  const [lists, setLists] = useState({
    holds: [...defaultLists.holds],
    movements: [...defaultLists.movements],
    constraints: [...defaultLists.constraints]
  });

  const [selectedItems, setSelectedItems] = useState({
    holds: "",
    movements: "",
    constraints: ""
  });

  const [editLists, setEditLists] = useState({
    holds: "",
    movements: "",
    constraints: ""
  });

  useEffect(() => {
    if (showSettings) {
      setEditLists({
        holds: lists.holds.join('\n'),
        movements: lists.movements.join('\n'),
        constraints: lists.constraints.join('\n')
      });
    }
  }, [showSettings]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlotVisibility([true, false, false]);

      setTimeout(() => {
        setSlotVisibility([true, true, false]);

        setTimeout(() => {
          setSlotVisibility([true, true, true]);

          generateChallenge();
        }, 300);
      }, 300);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadSavedLists();
  }, []);

  const loadSavedLists = async () => {
    try {
      const savedLists = await AsyncStorage.getItem('boulderboy_lists');
      if (savedLists) {
        setLists(JSON.parse(savedLists));
      }
    } catch (error) {
      console.error('Failed to load lists', error);
    }
  };

  const generateChallenge = () => {
    const randomHold = lists.holds[Math.floor(Math.random() * lists.holds.length)];
    const randomMovement = lists.movements[Math.floor(Math.random() * lists.movements.length)];
    const randomConstraint = lists.constraints[Math.floor(Math.random() * lists.constraints.length)];

    setTimeout(() => {
      setSelectedItems(prev => ({ ...prev, holds: randomHold }));

      setTimeout(() => {
        setSelectedItems(prev => ({ ...prev, movements: randomMovement }));

        setTimeout(() => {
          setSelectedItems(prev => ({ ...prev, constraints: randomConstraint }));
        }, 500);
      }, 400);
    }, 100);
  };

  const saveLists = () => {
    const newLists = {
      holds: editLists.holds.split('\n').filter(item => item.trim() !== ''),
      movements: editLists.movements.split('\n').filter(item => item.trim() !== ''),
      constraints: editLists.constraints.split('\n').filter(item => item.trim() !== '')
    };

    setLists(newLists);

    // Save to AsyncStorage
    AsyncStorage.setItem('boulderboy_lists', JSON.stringify(newLists)).catch(err => {
      console.error('Failed to save lists', err);
    });

    setShowSettings(false);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };

  const theme = {
    deviceColor: isDarkMode ? '#262626' : '#e0e3e4',
    deviceDark: isDarkMode ? '#1A1A1A' : '#373737',
    deviceAccent: isDarkMode ? '#9747FF' : '#6B3E75',
    screenBg: isDarkMode ? '#0F380F' : '#9BBC0F',
    screenDark: isDarkMode ? '#071F07' : '#0F380F',
    screenMid: isDarkMode ? '#1E3F1E' : '#306230',
    screenLight: isDarkMode ? '#306230' : '#8BAC0F',
    btnColor: isDarkMode ? '#353535' : '#333333',
    btnA: isDarkMode ? '#D14B8F' : '#A93671',
    btnB: isDarkMode ? '#4A76D1' : '#3657A3',
    textColor: isDarkMode ? '#8BAC0F' : '#0F380F',
    textInverse: isDarkMode ? '#0F380F' : '#8BAC0F',
    dotColor: isDarkMode ? '#ffffff' : '#000000',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#d5d5d5' }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <View style={[styles.dotPattern, {
        opacity: isDarkMode ? 0.05 : 0.1,
        backgroundImage: `radial-gradient(circle, ${theme.dotColor} 1px, transparent 1px)`
      }]} />

      <View style={[styles.gameboy, { backgroundColor: theme.deviceColor }]}>
        <View style={styles.gameboyInner}>
          <View style={styles.logoContainer}>
            <Text style={[styles.logoSubtitle, { color: '#808080' }]}>BOULDER BOY</Text>
          </View>

          <View style={[styles.screenArea, { backgroundColor: theme.deviceDark }]}>
            <View style={[styles.screenPower, { backgroundColor: theme.deviceAccent }]} />
            <Text style={[styles.screenLabel, { color: 'rgba(255, 255, 255, 0.6)' }]}>LCD COLOR</Text>

            <View style={[styles.screen, {
              backgroundColor: theme.screenBg,
              borderColor: theme.deviceDark
            }]}>
              <View style={styles.slotsContainer}>
                <View style={[
                  styles.slot,
                  {
                    backgroundColor: theme.screenDark,
                    borderColor: theme.screenMid,
                    opacity: slotVisibility[0] ? 1 : 0
                  }
                ]}>
                  <Text style={[styles.slotTitle, {
                    backgroundColor: theme.screenDark,
                    color: theme.screenLight
                  }]}>HOLDS</Text>
                  <View style={styles.slotWindow}>
                    <Text style={[styles.slotItem, { color: theme.screenLight }]}>
                      {selectedItems.holds}
                    </Text>
                  </View>
                </View>

                <View style={[
                  styles.slot,
                  {
                    backgroundColor: theme.screenDark,
                    borderColor: theme.screenMid,
                    opacity: slotVisibility[1] ? 1 : 0
                  }
                ]}>
                  <Text style={[styles.slotTitle, {
                    backgroundColor: theme.screenDark,
                    color: theme.screenLight
                  }]}>MOVEMENTS</Text>
                  <View style={styles.slotWindow}>
                    <Text style={[styles.slotItem, { color: theme.screenLight }]}>
                      {selectedItems.movements}
                    </Text>
                  </View>
                </View>

                <View style={[
                  styles.slot,
                  {
                    backgroundColor: theme.screenDark,
                    borderColor: theme.screenMid,
                    opacity: slotVisibility[2] ? 1 : 0
                  }
                ]}>
                  <Text style={[styles.slotTitle, {
                    backgroundColor: theme.screenDark,
                    color: theme.screenLight
                  }]}>CONSTRAINTS</Text>
                  <View style={styles.slotWindow}>
                    <Text style={[styles.slotItem, { color: theme.screenLight }]}>
                      {selectedItems.constraints}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.controls}>
            <View style={styles.dpad}>
              <View style={[styles.dpadCross, styles.dpadHorizontal, { backgroundColor: theme.btnColor }]} />
              <View style={[styles.dpadCross, styles.dpadVertical, { backgroundColor: theme.btnColor }]} />
              <View style={[styles.dpadCenterIndent, { backgroundColor: theme.btnColor }]} />
            </View>

            <View style={styles.actionBtnsContainer}>
              <View style={styles.actionBtns}>
                <View style={[styles.actionBtn, { backgroundColor: theme.btnB }]}>
                  <Text style={styles.actionBtnLabel}>B</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionBtn,
                    {
                      backgroundColor: theme.btnA,
                      transform: [{ translateY: pressed ? 2 : 0 }]
                    }
                  ]}
                  onPress={generateChallenge}
                >
                  <Text style={styles.actionBtnLabel}>A</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.startSelect}>
            <View style={styles.startSelectBtnContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.startSelectBtn,
                  {
                    backgroundColor: theme.deviceDark,
                    transform: [
                      { rotate: '-25deg' },
                      { translateY: pressed ? 1 : 0 }
                    ]
                  }
                ]}
                onPress={() => setShowSettings(true)}
              />
              <Text style={styles.startSelectLabel}>SELECT</Text>
            </View>

            <View style={styles.startSelectBtnContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.startSelectBtn,
                  {
                    backgroundColor: theme.deviceDark,
                    transform: [
                      { rotate: '-25deg' },
                      { translateY: pressed ? 1 : 0 }
                    ]
                  }
                ]}
                onPress={() => setIsDarkMode(!isDarkMode)}
              />
              <Text style={styles.startSelectLabel}>START</Text>
            </View>
          </View>

          <View style={styles.speakers}>
            {[...Array(6)].map((_, i) => (
              <View key={i} style={[styles.speaker, { backgroundColor: theme.deviceDark }]} />
            ))}
          </View>
        </View>
      </View>

      {showSettings && (
        <View style={styles.settingsOverlay}>
          <View style={[styles.settingsPanel, { backgroundColor: theme.deviceColor }]}>
            <View style={[styles.settingsHeader, { borderBottomColor: theme.deviceDark }]}>
              <Text style={[styles.settingsTitle, { color: theme.deviceDark }]}>EDIT LISTS</Text>
              <Pressable onPress={() => setShowSettings(false)} style={styles.closeButton}>
                <Text style={[styles.closeBtn, { color: theme.deviceDark }]}>×</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.settingsContent}>
              <View style={styles.tabsContainer}>
                <Pressable
                  style={[
                    styles.tabButton,
                    { backgroundColor: theme.screenBg, borderColor: theme.deviceDark }
                  ]}
                >
                  <Text style={[styles.tabButtonText, { color: theme.textColor }]}>EDIT</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.tabButton,
                    { backgroundColor: theme.deviceDark, borderColor: theme.deviceDark }
                  ]}
                  onPress={() => setIsDarkMode(!isDarkMode)}
                >
                  <Text style={[styles.tabButtonText, { color: 'white' }]}>
                    {isDarkMode ? 'LIGHT' : 'DARK'}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.instructionsContainer}>
                <Text style={[styles.instructionsText, { color: theme.deviceDark }]}>
                  ADD OR EDIT ITEMS BELOW
                </Text>
                <Text style={[styles.instructionsSubtext, { color: theme.deviceDark }]}>
                  ONE ITEM PER LINE
                </Text>
              </View>

              <View style={styles.settingsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.settingsSectionTitle, { color: theme.deviceDark }]}>HOLDS</Text>
                  <Text style={[styles.itemCount, { color: theme.deviceDark }]}>
                    {lists.holds.length} ITEMS
                  </Text>
                </View>
                <TextInput
                  style={[styles.editArea, {
                    backgroundColor: theme.screenBg,
                    borderColor: theme.deviceDark,
                    color: theme.textColor
                  }]}
                  multiline
                  value={editLists.holds}
                  onChangeText={(text) => setEditLists(prev => ({ ...prev, holds: text }))}
                  placeholder="One hold type per line"
                  placeholderTextColor={`${theme.textColor}80`}
                />
              </View>

              <View style={styles.settingsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.settingsSectionTitle, { color: theme.deviceDark }]}>MOVEMENTS</Text>
                  <Text style={[styles.itemCount, { color: theme.deviceDark }]}>
                    {lists.movements.length} ITEMS
                  </Text>
                </View>
                <TextInput
                  style={[styles.editArea, {
                    backgroundColor: theme.screenBg,
                    borderColor: theme.deviceDark,
                    color: theme.textColor
                  }]}
                  multiline
                  value={editLists.movements}
                  onChangeText={(text) => setEditLists(prev => ({ ...prev, movements: text }))}
                  placeholder="One movement per line"
                  placeholderTextColor={`${theme.textColor}80`}
                />
              </View>

              <View style={styles.settingsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.settingsSectionTitle, { color: theme.deviceDark }]}>CONSTRAINTS</Text>
                  <Text style={[styles.itemCount, { color: theme.deviceDark }]}>
                    {lists.constraints.length} ITEMS
                  </Text>
                </View>
                <TextInput
                  style={[styles.editArea, {
                    backgroundColor: theme.screenBg,
                    borderColor: theme.deviceDark,
                    color: theme.textColor
                  }]}
                  multiline
                  value={editLists.constraints}
                  onChangeText={(text) => setEditLists(prev => ({ ...prev, constraints: text }))}
                  placeholder="One constraint per line"
                  placeholderTextColor={`${theme.textColor}80`}
                />
              </View>
            </ScrollView>

            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.cancelBtn, {
                  backgroundColor: theme.deviceDark,
                  borderColor: theme.deviceDark
                }]}
                onPress={() => setShowSettings(false)}
              >
                <Text style={styles.cancelBtnText}>CANCEL</Text>
              </Pressable>

              <Pressable
                style={[styles.saveBtn, {
                  backgroundColor: theme.btnA,
                  borderColor: theme.deviceDark
                }]}
                onPress={saveLists}
              >
                <Text style={styles.saveBtnText}>SAVE</Text>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.deviceDark }]}>
                MADE BY <Text
                  style={[styles.boldText, { textDecorationLine: 'underline' }]}
                  onPress={() => Linking.openURL('https://instagram.com/thatowais')}
                >
                  THATOWAIS
                </Text>
              </Text>
            </View>
          </View>
        </View>
      )}

      {showFeedback && (
        <View style={[styles.feedback, {
          backgroundColor: theme.screenBg,
          borderColor: theme.deviceDark
        }]}>
          <Text style={[styles.feedbackText, { color: theme.textColor }]}>SAVED!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
  },
  dotPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    backgroundSize: '20px 20px',
  },
  gameboy: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 12,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 12,
    padding: 15,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 30,
  },
  gameboyInner: {
    width: '100%',
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    fontFamily: 'PressStart2P',
  },
  logoSubtitle: {
    fontSize: 8,
    fontFamily: 'PressStart2P',
    marginTop: 2,
  },
  screenArea: {
    borderRadius: 10,
    padding: 15,
    paddingBottom: 35,
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
  screenPower: {
    position: 'absolute',
    top: 7,
    left: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowColor: '#aa22aa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  screenLabel: {
    position: 'absolute',
    top: 7,
    right: 10,
    fontSize: 5,
    letterSpacing: 0.5,
    fontFamily: 'PressStart2P',
  },
  screen: {
    borderRadius: 5,
    borderWidth: 3,
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: .3,
    shadowRadius: 0,
    elevation: 5,
  },
  slotsContainer: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  slot: {
    position: 'relative',
    height: '30%',
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: .3,
    shadowRadius: 0,
    elevation: 3,
    opacity: 0,
  },
  slotTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 8,
    padding: 6,
    paddingHorizontal: 8,
    zIndex: 10,
    fontFamily: 'PressStart2P',
  },
  slotWindow: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  slotItem: {
    fontSize: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    fontFamily: 'PressStart2P',
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  dpad: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dpadCross: {
    position: 'absolute',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 4,
  },
  dpadHorizontal: {
    width: 80,
    height: 26,
    zIndex: 1,
  },
  dpadVertical: {
    width: 26,
    height: 80,
    zIndex: 1,
  },
  dpadCenterIndent: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.3)',
    zIndex: 2,
    opacity: 0.4,
  },
  actionBtnsContainer: {
    alignItems: 'center',
  },
  actionBtns: {
    flexDirection: 'row',
    transform: [{ rotate: '-20deg' }],
  },
  actionBtn: {
    width: 45,
    height: 45,
    marginHorizontal: 8,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: .3,
    shadowRadius: 0,
    elevation: 5,
  },
  actionBtnLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PressStart2P',
  },
  startSelect: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 20,
  },
  startSelectBtnContainer: {
    alignItems: 'center',
  },
  startSelectBtn: {
    width: 40,
    height: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: .3,
    shadowRadius: 0,
    elevation: 3,
    marginBottom: 14,
  },
  startSelectLabel: {
    fontSize: 8,
    fontFamily: 'PressStart2P',
    color: '#808080',
  },
  speakers: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    flexDirection: 'column',
    gap: 3,
  },
  speaker: {
    width: 25,
    height: 3,
    borderRadius: 2,
  },
  settingsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 998,
  },
  settingsPanel: {
    width: '90%',
    maxWidth: 340,
    maxHeight: '85%',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: .3,
    shadowRadius: 0,
    elevation: 10,
    zIndex: 999,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'PressStart2P',
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsContent: {
    maxHeight: 400,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 5,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  tabButtonText: {
    fontSize: 10,
    fontFamily: 'PressStart2P',
  },
  instructionsContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 10,
    fontFamily: 'PressStart2P',
    marginBottom: 5,
  },
  instructionsSubtext: {
    fontSize: 8,
    fontFamily: 'PressStart2P',
  },
  settingsSection: {
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingsSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'PressStart2P',
  },
  itemCount: {
    fontSize: 8,
    fontFamily: 'PressStart2P',
  },
  editArea: {
    width: '100%',
    minHeight: 80,
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    marginBottom: 5,
    fontFamily: 'PressStart2P',
    fontSize: 10,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 8,
    fontFamily: 'PressStart2P',
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: .3,
    shadowRadius: 0,
  },
  cancelBtnText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'PressStart2P',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 5,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: .3,
    shadowRadius: 0,
  },
  saveBtnText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'PressStart2P',
  },
  feedback: {
    position: 'absolute',
    bottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 2,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: .3,
    shadowRadius: 0,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'PressStart2P',
  },
});