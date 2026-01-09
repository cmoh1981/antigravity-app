import { Modal, View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { ExerciseSet } from '@/types';
import { getExerciseGif } from '@/data/exercise-gifs';
import * as Haptics from 'expo-haptics';

interface ExerciseDetailModalProps {
  visible: boolean;
  exercise: ExerciseSet | null;
  onClose: () => void;
}

export function ExerciseDetailModal({ visible, exercise, onClose }: ExerciseDetailModalProps) {
  const colors = useColors();

  if (!exercise) return null;

  const gifData = getExerciseGif(exercise.name);

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              {exercise.name}
            </Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: colors.muted }]}>✕</Text>
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* GIF Placeholder */}
            <View style={[styles.gifContainer, { backgroundColor: colors.surface }]}>
              <Text style={{ fontSize: 64 }}>🏃‍♂️</Text>
              <Text style={[styles.gifLabel, { color: colors.muted }]}>
                운동 시연 GIF
              </Text>
            </View>

            {/* Description */}
            {gifData?.description && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  설명
                </Text>
                <Text style={[styles.descriptionText, { color: colors.muted }]}>
                  {gifData.description}
                </Text>
              </View>
            )}

            {/* Exercise Details */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                운동 정보
              </Text>
              <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
                {exercise.duration && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>
                      시간
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.foreground }]}>
                      {exercise.duration}초
                    </Text>
                  </View>
                )}
                {exercise.reps && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>
                      반복 횟수
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.foreground }]}>
                      {exercise.reps}회
                    </Text>
                  </View>
                )}
                {exercise.sets && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>
                      세트 수
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.foreground }]}>
                      {exercise.sets}세트
                    </Text>
                  </View>
                )}
                {exercise.description && (
                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                    <Text style={[styles.detailLabel, { color: colors.muted }]}>
                      방법
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.foreground, flex: 1 }]}>
                      {exercise.description}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Tips */}
            {gifData?.tips && gifData.tips.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  💡 팁
                </Text>
                <View style={[styles.tipsCard, { backgroundColor: `${colors.primary}10` }]}>
                  {gifData.tips.map((tip, index) => (
                    <View key={index} style={styles.tipRow}>
                      <Text style={[styles.tipBullet, { color: colors.primary }]}>•</Text>
                      <Text style={[styles.tipText, { color: colors.foreground }]}>
                        {tip}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Safety Note */}
            <View style={[styles.safetyNote, { backgroundColor: `${colors.warning}15` }]}>
              <Text style={[styles.safetyTitle, { color: colors.warning }]}>
                ⚠️ 주의사항
              </Text>
              <Text style={[styles.safetyText, { color: colors.foreground }]}>
                운동 중 통증이나 불편함이 있다면 즉시 중단하세요.
              </Text>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.8 }
              ]}
            >
              <Text style={styles.actionButtonText}>확인</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  gifContainer: {
    height: 200,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  gifLabel: {
    fontSize: 14,
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  detailCard: {
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  tipsCard: {
    borderRadius: 12,
    padding: 16,
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  safetyNote: {
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  safetyText: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
