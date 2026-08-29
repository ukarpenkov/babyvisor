import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { ComponentProps, PropsWithChildren, useMemo, useState } from 'react'
import {
    LayoutAnimation,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    UIManager,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppTheme } from '../../constants/theme'
import { useAppTheme } from '../../hooks/useAppTheme'

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true)
}

type Stage = {
    title: string
    subtitle: string
    icon: ComponentProps<typeof MaterialIcons>['name']
    body: string
}

const STAGES: Stage[] = [
    {
        title: 'При рождении (0–1 месяц)',
        subtitle: 'Крупные контрастные объекты рядом',
        icon: 'visibility',
        body: 'Мир размыт и состоит из черно-бело-серых пятен. Ребенок может увидеть лишь крупные контрастные объекты, если они находятся совсем близко — как лицо матери при кормлении. Фокус слабый и удерживается лишь на долю секунды. Глаза "скачут", а зрение работает только на расстоянии 20–30 см — как будто у ребенка «туман перед глазами».\n\nГлаза могут казаться "косыми" — это норма. Лучше всего новорожденные реагируют на черно-белые узоры.',
    },
    {
        title: '1 месяц',
        subtitle: 'Появляются оттенки серого',
        icon: 'blur-on',
        body: 'Зрение всё ещё размытое, но появляются оттенки серого. Контрастные формы становятся немного четче. Ребенок дольше фиксирует взгляд на лице или игрушке, особенно на знакомых. Горизонтальное слежение становится плавнее. Цвета вроде ярко-красного и зеленого могут начать различаться, но черно-белое всё ещё интереснее.\n\nКосоглазие всё ещё может проявляться, но становится реже.',
    },
    {
        title: '2 месяца',
        subtitle: 'Черты лица и первые цвета',
        icon: 'face',
        body: 'Ребенок начинает различать черты лица — глаза, рот, брови. Слежение становится увереннее: малыш может следить за игрушкой, движущейся по кругу. Цвета — красный, желтый, зеленый, синий — становятся узнаваемыми и привлекательными.\n\nКоординация глаз улучшается, косоглазие встречается всё реже. Впервые может появиться осознанная улыбка при зрительном контакте.',
    },
    {
        title: '3 месяца',
        subtitle: 'Фокус и координация рука–глаз',
        icon: 'pan-tool',
        body: 'Ребенок с любопытством разглядывает свои руки, одежду, игрушки. Может хорошо фокусироваться на расстояниях от 20 см до нескольких метров. Появляется аккомодация — способность менять фокус.\n\nЦветовосприятие улучшилось: оттенки становятся разнообразнее. Координация "глаз-рука" позволяет тянуться к игрушкам. Начинается развитие восприятия глубины.',
    },
    {
        title: '4 месяца',
        subtitle: 'Детали через всю комнату',
        icon: 'palette',
        body: 'Зрение становится четче, насыщеннее по цвету. Ребенок замечает мелкие детали, может различить человека или предмет через всю комнату. Быстро следит за движущимися объектами — даже за мячом или собакой.\n\nЦветовое зрение почти на уровне взрослого. Координация "рука-глаз" дает возможность точно хватать предметы, часто одной рукой.',
    },
    {
        title: '6 месяцев',
        subtitle: 'Глубина и постоянство объекта',
        icon: 'child-care',
        body: 'Зрение значительно острее — 20/50–20/100. Малыш видит четко, различает формы и цвета. Хорошо развито восприятие глубины: ребенок оценивает расстояние до предметов при ползании.\n\nОтличная координация позволяет ловко хватать и перекладывать предметы. Возникает понятие постоянства объекта — малыш ищет упавшую игрушку, даже если её не видно.',
    },
    {
        title: '1 год',
        subtitle: 'Почти взрослое зрение',
        icon: 'sentiment-satisfied',
        body: 'Почти взрослое зрение: острота до 20/25, хорошее восприятие глубины, тонких цветов и мелких деталей. Малыш легко узнает предметы, людей на расстоянии, "читает" картинки.\n\nРазвивается способность целенаправленно действовать: указать пальцем, строить башню из кубиков, подражать действиям.',
    },
]

const TIPS = [
    'Контрастные игрушки (особенно черно-белые)',
    'Общение лицом к лицу на расстоянии 20–30 см',
    'Медленное движение предметов перед глазами',
    'Первое посещение офтальмолога — в 6–12 месяцев, особенно при рисках (напр., косоглазие после 4 месяцев, отсутствие реакции на свет).',
]

interface CollapsibleSectionProps {
    title: string
    subtitle: string
    icon: ComponentProps<typeof MaterialIcons>['name']
}

function CollapsibleSection({
    title,
    subtitle,
    icon,
    children,
}: PropsWithChildren<CollapsibleSectionProps>) {
    const theme = useAppTheme()
    const styles = useMemo(() => createStyles(theme), [theme])
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setIsCollapsed(!isCollapsed)
    }

    return (
        <View style={styles.card}>
            <Pressable
                style={styles.header}
                onPress={toggle}
                android_ripple={{ color: theme.colors.ripple }}
                accessibilityRole="button"
                accessibilityState={{ expanded: !isCollapsed }}
            >
                <View
                    style={[
                        styles.iconWrap,
                        { backgroundColor: theme.colors.primaryContainer },
                    ]}
                >
                    <MaterialIcons
                        name={icon}
                        size={20}
                        color={theme.colors.onPrimaryContainer}
                    />
                </View>
                <View style={styles.headerTextWrap}>
                    <Text style={styles.headerText}>{title}</Text>
                    <Text style={styles.headerSubtext}>{subtitle}</Text>
                </View>
                <MaterialIcons
                    name={isCollapsed ? 'expand-more' : 'expand-less'}
                    size={24}
                    color={theme.colors.onSurfaceVariant}
                />
            </Pressable>
            {!isCollapsed && (
                <>
                    <View style={styles.divider} />
                    <View style={styles.content}>{children}</View>
                </>
            )}
        </View>
    )
}

export default function AboutScreen() {
    const theme = useAppTheme()
    const styles = useMemo(() => createStyles(theme), [theme])

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Развитие зрения</Text>
                <Text style={styles.subtitle}>
                    Как меняется взгляд малыша в первый год жизни
                </Text>

                <Text style={styles.sectionLabel}>Этапы первого года</Text>

                {STAGES.map((stage) => (
                    <CollapsibleSection
                        key={stage.title}
                        title={stage.title}
                        subtitle={stage.subtitle}
                        icon={stage.icon}
                    >
                        <Text style={styles.paragraph}>{stage.body}</Text>
                    </CollapsibleSection>
                ))}

                <View style={styles.tipsCard}>
                    <View style={styles.tipsHeader}>
                        <View
                            style={[
                                styles.iconWrap,
                                {
                                    backgroundColor:
                                        theme.colors.surfaceContainerLowest,
                                },
                            ]}
                        >
                            <MaterialIcons
                                name="lightbulb-outline"
                                size={20}
                                color={theme.colors.onPrimaryContainer}
                            />
                        </View>
                        <Text style={styles.tipsTitle}>Важно помнить</Text>
                    </View>
                    <Text style={styles.tipsLead}>
                        Индивидуальные различия в развитии — это норма. Для
                        раннего развития зрения полезны:
                    </Text>
                    {TIPS.map((tip) => (
                        <View key={tip} style={styles.tipRow}>
                            <MaterialIcons
                                name="check-circle"
                                size={18}
                                color={theme.colors.onPrimaryContainer}
                            />
                            <Text style={styles.tipText}>{tip}</Text>
                        </View>
                    ))}
                    <Text style={styles.tipsFooter}>
                        Первый год жизни — путь от черно-белой дымки до
                        объемного, цветного и полного деталей мира.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

function createStyles(theme: AppTheme) {
    const { colors, radii, space } = theme

    return StyleSheet.create({
        safe: {
            flex: 1,
            backgroundColor: colors.background,
        },
        container: {
            flex: 1,
        },
        contentContainer: {
            paddingHorizontal: space.lg,
            paddingTop: space.lg,
            paddingBottom: space.xxl,
        },
        title: {
            fontSize: 28,
            fontWeight: '400',
            color: colors.onSurface,
            marginBottom: space.sm,
        },
        subtitle: {
            fontSize: 16,
            lineHeight: 24,
            color: colors.onSurfaceVariant,
            marginBottom: space.xl,
        },
        sectionLabel: {
            fontSize: 12,
            fontWeight: '500',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: colors.onSurfaceVariant,
            marginBottom: space.md,
        },
        card: {
            backgroundColor: theme.dark
                ? colors.surfaceContainer
                : colors.surfaceContainerLowest,
            borderRadius: radii.md,
            marginBottom: space.sm,
            overflow: 'hidden',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: space.md,
            paddingVertical: space.md,
            gap: space.md,
        },
        iconWrap: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTextWrap: {
            flex: 1,
        },
        headerText: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.onSurface,
        },
        headerSubtext: {
            fontSize: 13,
            lineHeight: 18,
            color: colors.onSurfaceVariant,
            marginTop: 2,
        },
        divider: {
            height: StyleSheet.hairlineWidth,
            backgroundColor: colors.outlineVariant,
            marginLeft: 64,
        },
        content: {
            paddingHorizontal: space.lg,
            paddingVertical: space.lg,
        },
        paragraph: {
            fontSize: 15,
            lineHeight: 22,
            color: colors.onSurfaceVariant,
        },
        tipsCard: {
            backgroundColor: colors.primaryContainer,
            borderRadius: radii.md,
            padding: space.lg,
            marginTop: space.md,
        },
        tipsHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.md,
            marginBottom: space.md,
        },
        tipsTitle: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.onPrimaryContainer,
        },
        tipsLead: {
            fontSize: 14,
            lineHeight: 20,
            color: colors.onPrimaryContainer,
            marginBottom: space.md,
            opacity: 0.9,
        },
        tipRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: space.sm,
            marginBottom: space.md,
        },
        tipText: {
            flex: 1,
            fontSize: 14,
            lineHeight: 20,
            color: colors.onPrimaryContainer,
        },
        tipsFooter: {
            fontSize: 14,
            lineHeight: 20,
            color: colors.onPrimaryContainer,
            marginTop: space.sm,
            fontWeight: '500',
        },
    })
}
