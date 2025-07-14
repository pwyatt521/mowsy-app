import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '../../components';
import { colors, textStyles, spacing } from '../../constants';
import { useNavigation, useLinkTo, useFocusEffect } from '@react-navigation/native';
import { useGetUserEquipmentQuery, useDeleteEquipmentMutation, useGetEquipmentQuery, Equipment } from '../../store/slices/equipmentApi';

type TabType = 'browse' | 'my-equipment';

export const EquipmentScreen = () => {
  const navigation = useNavigation();
  const linkTo = useLinkTo();
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch user's equipment - only when on my-equipment tab
  const { data: userEquipment, isLoading: userEquipmentLoading, error: userEquipmentError, refetch: refetchUserEquipment } = useGetUserEquipmentQuery(undefined, {
    skip: activeTab !== 'my-equipment'
  });

  // Fetch browse equipment - only when on browse tab
  const { data: browseEquipment, isLoading: browseEquipmentLoading, error: browseEquipmentError, refetch: refetchBrowseEquipment } = useGetEquipmentQuery({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  }, {
    skip: activeTab !== 'browse'
  });

  // Delete equipment mutation
  const [deleteEquipment, { isLoading: isDeleting }] = useDeleteEquipmentMutation();

  const handleDeleteEquipment = async (equipmentId: number, equipmentName: string) => {
    try {
      await deleteEquipment(equipmentId).unwrap();
      // Equipment will be automatically removed from the list due to RTK Query cache invalidation
    } catch (error) {
      Alert.alert('Error', 'Failed to delete equipment. Please try again.');
    }
  };

  // Refetch equipment when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (activeTab === 'my-equipment') {
        refetchUserEquipment();
      } else if (activeTab === 'browse') {
        refetchBrowseEquipment();
      }
    }, [activeTab, refetchUserEquipment, refetchBrowseEquipment])
  );

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' as const },
    { id: 'lawn_mowers', name: 'Lawn Mowers', icon: 'leaf' as const },
    { id: 'trimmers', name: 'Trimmers', icon: 'cut' as const },
    { id: 'blowers', name: 'Blowers', icon: 'partly-sunny' as const },
    { id: 'edgers', name: 'Edgers', icon: 'git-branch' as const },
    { id: 'tillers', name: 'Tillers', icon: 'settings' as const },
    { id: 'chainsaws', name: 'Chainsaws', icon: 'git-branch' as const },
    { id: 'pressure_washers', name: 'Pressure Washers', icon: 'water' as const },
    { id: 'other', name: 'Other', icon: 'ellipsis-horizontal' as const },
  ];

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
            {browseEquipmentLoading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading available equipment...</Text>
              </View>
            )}
            
            {browseEquipmentError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading equipment</Text>
                <Button
                  title="Retry"
                  onPress={() => refetchBrowseEquipment()}
                  variant="secondary"
                  size="small"
                />
              </View>
            )}
            
            {!browseEquipmentLoading && !browseEquipmentError && browseEquipment && browseEquipment.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No equipment available</Text>
                <Text style={styles.emptySubtext}>Try adjusting your filters or check back later</Text>
              </View>
            )}
            
            {!browseEquipmentLoading && !browseEquipmentError && browseEquipment && browseEquipment.length > 0 && (
              browseEquipment.map((item) => (
                <BrowseEquipmentCard key={item.id} equipment={item} />
              ))
            )}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.myEquipmentHeader}>
          <Button
            title="Add Equipment"
            onPress={() => linkTo('/equipment/add-equipment')}
            variant="primary"
            size="medium"
            style={styles.addEquipmentButton}
          />
        </View>
        
        <ScrollView style={styles.equipmentList}>
          <Text style={styles.sectionTitle}>My Equipment</Text>
          
          {userEquipmentLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading your equipment...</Text>
            </View>
          )}
          
          {userEquipmentError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error loading equipment</Text>
              <Button
                title="Retry"
                onPress={() => refetchUserEquipment()}
                variant="secondary"
                size="small"
              />
            </View>
          )}
          
          {!userEquipmentLoading && !userEquipmentError && userEquipment && userEquipment.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven't added any equipment yet</Text>
              <Text style={styles.emptySubtext}>Tap "Add Equipment" above to get started</Text>
            </View>
          )}
          
          {!userEquipmentLoading && !userEquipmentError && userEquipment && userEquipment.length > 0 && (
            userEquipment.map((item) => (
              <MyEquipmentCard 
                key={item.id} 
                equipment={item} 
                onDelete={() => handleDeleteEquipment(item.id, item.name)}
                isDeleting={isDeleting}
              />
            ))
          )}
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

const BrowseEquipmentCard = ({ equipment }: { equipment: Equipment }) => {
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffHours < 1) return 'Just now';
      if (diffHours === 1) return '1 hour ago';
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays === 1) return '1 day ago';
      return `${diffDays} days ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <Card style={styles.browseEquipmentCard} padding="lg">
      <View style={styles.browseEquipmentCardHeader}>
        <Text style={styles.browseEquipmentTitle}>{equipment.name}</Text>
        <Text style={styles.browseEquipmentPrice}>${equipment.daily_rental_price}/day</Text>
      </View>
      
      <Text style={styles.browseEquipmentDescription} numberOfLines={3}>{equipment.description}</Text>
      
      <View style={styles.browseEquipmentMeta}>
        <View style={styles.browseEquipmentMetaLeft}>
          <View style={styles.browseEquipmentMetaItem}>
            <Ionicons name="location" size={16} color={colors.textSecondary} />
            <Text style={styles.browseEquipmentMetaText}>{equipment.address}</Text>
          </View>
          <View style={styles.browseEquipmentMetaItem}>
            <Ionicons name="star" size={16} color={colors.accent} />
            <Text style={styles.browseEquipmentMetaText}>{equipment.user.rating?.toFixed(1) || '0.0'} ({equipment.user.review_count || 0})</Text>
          </View>
        </View>
        <View style={styles.browseEquipmentMetaItem}>
          <Ionicons name="checkmark-circle" size={16} color={equipment.is_available ? colors.success : colors.textSecondary} />
          <Text style={styles.browseEquipmentMetaText}>{equipment.is_available ? 'Available' : 'Unavailable'}</Text>
        </View>
      </View>
      
      <View style={styles.browseEquipmentFooter}>
        <Text style={styles.browseEquipmentPoster}>by {equipment.user.first_name} {equipment.user.last_name}</Text>
        <View style={styles.browseEquipmentFooterRight}>
          <Text style={styles.browseEquipmentPosted}>{formatTimeAgo(equipment.created_at)}</Text>
          <Button
            title={equipment.is_available ? "Request Rental" : "Unavailable"}
            onPress={() => {}}
            variant="primary"
            size="small"
            disabled={!equipment.is_available}
          />
        </View>
      </View>
    </Card>
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

const MyEquipmentCard = ({ equipment, onDelete, isDeleting }) => {
  const navigation = useNavigation();
  // Format the date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
      return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <Card style={styles.myEquipmentCard}>
      <View style={styles.myEquipmentHeader}>
        <View style={styles.myEquipmentHeaderLeft}>
          <Text style={styles.myEquipmentTitle}>{equipment.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          disabled={isDeleting}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="trash" 
            size={20} 
            color={colors.error} 
          />
        </TouchableOpacity>
      </View>
      
      {equipment.description && (
        <Text style={styles.myEquipmentDescription} numberOfLines={2}>
          {equipment.description}
        </Text>
      )}
      
      <View style={styles.myEquipmentInfo}>
        <View style={styles.myEquipmentMetaItem}>
          <Ionicons name="cash" size={16} color={colors.primary} />
          <Text style={styles.myEquipmentMetaText}>${equipment.daily_rental_price}/day</Text>
        </View>
        
        {equipment.make && (
          <View style={styles.myEquipmentMetaItem}>
            <Ionicons name="build" size={16} color={colors.textSecondary} />
            <Text style={styles.myEquipmentMetaText}>{equipment.make} {equipment.model}</Text>
          </View>
        )}
        
        <View style={styles.myEquipmentMetaItem}>
          <Ionicons name="apps" size={16} color={colors.textSecondary} />
          <Text style={styles.myEquipmentMetaText}>{equipment.category}</Text>
        </View>
        
        <View style={styles.myEquipmentMetaItem}>
          <Ionicons name="calendar" size={16} color={colors.textSecondary} />
          <Text style={styles.myEquipmentMetaText}>Added {formatDate(equipment.created_at)}</Text>
        </View>
      </View>
      
      <View style={styles.myEquipmentActions}>
        <Button title="View Details" variant="text" size="small" onPress={() => {}} />
        <Button title="Edit" variant="secondary" size="small" onPress={() => navigation.navigate('UpdateEquipment', { id: equipment.id })} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
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
  browseEquipmentCard: {
    marginBottom: spacing.md,
  },
  equipmentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  browseEquipmentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
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
    marginBottom: spacing.md,
  },
  equipmentTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    flex: 1,
  },
  browseEquipmentTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.md,
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
  browseEquipmentPrice: {
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
  browseEquipmentDescription: {
    ...textStyles.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    lineHeight: 22,
    minHeight: 66,
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
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  equipmentMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
  equipmentMetaLeft: {
    flex: 1,
  },
  browseEquipmentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  browseEquipmentMetaLeft: {
    flex: 1,
  },
  browseEquipmentMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  browseEquipmentMetaText: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  equipmentPoster: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
  },
  browseEquipmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  browseEquipmentPoster: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
  },
  equipmentFooterRight: {
    alignItems: 'flex-end',
  },
  browseEquipmentFooterRight: {
    alignItems: 'flex-end',
  },
  equipmentPosted: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  browseEquipmentPosted: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
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
  myEquipmentHeaderLeft: {
    flex: 1,
  },
  myEquipmentDescription: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.body,
    color: colors.textSecondary,
  },
  errorContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  errorText: {
    ...textStyles.body,
    color: colors.error,
    marginBottom: spacing.md,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...textStyles.h4,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  deleteButton: {
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
  },
});