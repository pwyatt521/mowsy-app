import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '../../components';
import { colors, textStyles, spacing } from '../../constants';

type TabType = 'browse' | 'my-equipment';

export const EquipmentScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'mowers', name: 'Mowers', icon: 'leaf' },
    { id: 'trimmers', name: 'Trimmers', icon: 'cut' },
    { id: 'blowers', name: 'Blowers', icon: 'partly-sunny' },
    { id: 'edgers', name: 'Edgers', icon: 'git-branch' },
    { id: 'tillers', name: 'Tillers', icon: 'settings' },
  ];

  const equipment = [
    {
      id: 1,
      title: 'Honda Self-Propelled Mower',
      description: 'Honda GCV160 engine, 21" cutting deck, excellent condition',
      price: 25,
      distance: '0.2 miles',
      owner: 'Tom Wilson',
      rating: 4.9,
      category: 'mowers',
      available: true,
      specs: ['Gas powered', '21" deck', 'Self-propelled'],
    },
    {
      id: 2,
      title: 'Stihl Leaf Blower',
      description: 'Powerful handheld blower, perfect for clearing driveways',
      price: 15,
      distance: '0.4 miles',
      owner: 'Lisa Chen',
      rating: 4.8,
      category: 'blowers',
      available: true,
      specs: ['Gas powered', '185 mph', 'Handheld'],
    },
    {
      id: 3,
      title: 'Electric String Trimmer',
      description: 'Lightweight electric trimmer with extra line',
      price: 12,
      distance: '0.6 miles',
      owner: 'Mike Johnson',
      rating: 4.7,
      category: 'trimmers',
      available: false,
      specs: ['Electric', '13" cutting width', 'Auto-feed line'],
    },
  ];

  const myEquipment = [
    {
      id: 1,
      title: 'Craftsman Push Mower',
      status: 'available',
      earnings: '$150',
      rentalRequests: 2,
      category: 'mowers',
    },
    {
      id: 2,
      title: 'Ryobi Hedge Trimmer',
      status: 'rented',
      renterName: 'Sarah Davis',
      returnDate: '2024-01-15',
      category: 'trimmers',
    },
  ];

  const filteredEquipment = selectedCategory === 'all' 
    ? equipment 
    : equipment.filter(item => item.category === selectedCategory);

  const renderTabContent = () => {
    if (activeTab === 'browse') {
      return (
        <View style={styles.tabContent}>
          <View style={styles.filters}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Ionicons name={category.icon} size={20} color={
                    selectedCategory === category.id ? colors.white : colors.primary
                  } />
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.categoryButtonTextActive,
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.equipmentList}>
            {filteredEquipment.map((item) => (
              <EquipmentCard key={item.id} equipment={item} />
            ))}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.myEquipmentHeader}>
          <Button
            title="Add Equipment"
            onPress={() => {}}
            variant="primary"
            size="medium"
            style={styles.addEquipmentButton}
          />
        </View>
        
        <ScrollView style={styles.equipmentList}>
          <Text style={styles.sectionTitle}>My Equipment</Text>
          {myEquipment.map((item) => (
            <MyEquipmentCard key={item.id} equipment={item} />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Equipment</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
          onPress={() => setActiveTab('browse')}
        >
          <Text style={[styles.tabText, activeTab === 'browse' && styles.activeTabText]}>
            Browse Equipment
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-equipment' && styles.activeTab]}
          onPress={() => setActiveTab('my-equipment')}
        >
          <Text style={[styles.tabText, activeTab === 'my-equipment' && styles.activeTabText]}>
            My Equipment
          </Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}
    </SafeAreaView>
  );
};

const EquipmentCard = ({ equipment }) => (
  <Card style={styles.equipmentCard}>
    <View style={styles.equipmentImagePlaceholder}>
      <Ionicons name="construct" size={48} color={colors.placeholder} />
    </View>
    
    <View style={styles.equipmentInfo}>
      <View style={styles.equipmentHeader}>
        <Text style={styles.equipmentTitle}>{equipment.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.equipmentPrice}>${equipment.price}</Text>
          <Text style={styles.priceUnit}>/day</Text>
        </View>
      </View>
      
      <Text style={styles.equipmentDescription}>{equipment.description}</Text>
      
      <View style={styles.equipmentSpecs}>
        {equipment.specs.map((spec, index) => (
          <View key={index} style={styles.specBadge}>
            <Text style={styles.specText}>{spec}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.equipmentMeta}>
        <View style={styles.equipmentMetaItem}>
          <Ionicons name="location" size={16} color={colors.textSecondary} />
          <Text style={styles.equipmentMetaText}>{equipment.distance}</Text>
        </View>
        <View style={styles.equipmentMetaItem}>
          <Ionicons name="star" size={16} color={colors.accent} />
          <Text style={styles.equipmentMetaText}>{equipment.rating}</Text>
        </View>
        <View style={[styles.availabilityBadge, equipment.available ? styles.availableBadge : styles.unavailableBadge]}>
          <Text style={[styles.availabilityText, equipment.available ? styles.availableText : styles.unavailableText]}>
            {equipment.available ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>
      
      <View style={styles.equipmentFooter}>
        <Text style={styles.equipmentOwner}>by {equipment.owner}</Text>
        <Button
          title={equipment.available ? "Request Rental" : "Unavailable"}
          onPress={() => {}}
          variant="primary"
          size="small"
          disabled={!equipment.available}
        />
      </View>
    </View>
  </Card>
);

const MyEquipmentCard = ({ equipment }) => (
  <Card style={styles.myEquipmentCard}>
    <View style={styles.myEquipmentHeader}>
      <Text style={styles.myEquipmentTitle}>{equipment.title}</Text>
      <View style={[styles.statusBadge, styles[`${equipment.status}Badge`]]}>
        <Text style={[styles.statusText, styles[`${equipment.status}Text`]]}>
          {equipment.status}
        </Text>
      </View>
    </View>
    
    <View style={styles.myEquipmentInfo}>
      {equipment.earnings && (
        <View style={styles.myEquipmentMetaItem}>
          <Ionicons name="cash" size={16} color={colors.success} />
          <Text style={styles.myEquipmentMetaText}>Earned: {equipment.earnings}</Text>
        </View>
      )}
      
      {equipment.rentalRequests && (
        <View style={styles.myEquipmentMetaItem}>
          <Ionicons name="people" size={16} color={colors.primary} />
          <Text style={styles.myEquipmentMetaText}>{equipment.rentalRequests} pending requests</Text>
        </View>
      )}
      
      {equipment.renterName && (
        <View style={styles.myEquipmentMetaItem}>
          <Ionicons name="person" size={16} color={colors.warning} />
          <Text style={styles.myEquipmentMetaText}>Rented by {equipment.renterName}</Text>
        </View>
      )}
      
      {equipment.returnDate && (
        <View style={styles.myEquipmentMetaItem}>
          <Ionicons name="calendar" size={16} color={colors.warning} />
          <Text style={styles.myEquipmentMetaText}>Return: {equipment.returnDate}</Text>
        </View>
      )}
    </View>
    
    <View style={styles.myEquipmentActions}>
      <Button title="View Details" variant="text" size="small" onPress={() => {}} />
      <Button title="Edit" variant="secondary" size="small" onPress={() => {}} />
      {equipment.rentalRequests > 0 && (
        <Button title="View Requests" variant="primary" size="small" onPress={() => {}} />
      )}
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...textStyles.h2,
    color: colors.primary,
  },
  searchButton: {
    padding: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...textStyles.body,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  filters: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryFilter: {
    flexDirection: 'row',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    ...textStyles.bodySmall,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  equipmentList: {
    flex: 1,
    padding: spacing.md,
  },
  equipmentCard: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  equipmentImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  equipmentTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  equipmentPrice: {
    ...textStyles.h4,
    color: colors.primary,
    fontWeight: '600',
  },
  priceUnit: {
    ...textStyles.caption,
    color: colors.textSecondary,
  },
  equipmentDescription: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  equipmentSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  specBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  specText: {
    ...textStyles.caption,
    color: colors.primary,
  },
  equipmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  equipmentMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  equipmentMetaText: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  availabilityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  availableBadge: {
    backgroundColor: colors.success + '20',
  },
  unavailableBadge: {
    backgroundColor: colors.error + '20',
  },
  availabilityText: {
    ...textStyles.caption,
    fontWeight: '600',
  },
  availableText: {
    color: colors.success,
  },
  unavailableText: {
    color: colors.error,
  },
  equipmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipmentOwner: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
  },
  myEquipmentHeader: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addEquipmentButton: {
    alignSelf: 'flex-end',
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  myEquipmentCard: {
    marginBottom: spacing.md,
  },
  myEquipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  myEquipmentTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: colors.success + '20',
  },
  rentedBadge: {
    backgroundColor: colors.warning + '20',
  },
  statusText: {
    ...textStyles.caption,
    textTransform: 'capitalize',
  },
  availableText: {
    color: colors.success,
  },
  rentedText: {
    color: colors.warning,
  },
  myEquipmentInfo: {
    marginBottom: spacing.md,
  },
  myEquipmentMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  myEquipmentMetaText: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  myEquipmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
});