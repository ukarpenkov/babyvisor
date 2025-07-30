import React, { PropsWithChildren, useState } from 'react'
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

interface CollapsibleSectionProps {
    title: string
}

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true)
}

const CollapsibleSection: React.FC<
    PropsWithChildren<CollapsibleSectionProps>
> = ({ title, children }) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setIsCollapsed(!isCollapsed)
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.blobBackground} />
            <View style={styles.sectionContainer}>
                <Pressable style={styles.header} onPress={toggle}>
                    <Text style={styles.headerText}>{title}</Text>
                    <Text style={styles.icon}>{isCollapsed ? '⌵' : '⌃'}</Text>
                </Pressable>
                {!isCollapsed && <View style={styles.content}>{children}</View>}
            </View>
        </View>
    )
}

export default function AboutScreen() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Развитие зрения у младенцев</Text>

            <CollapsibleSection title="При рождении (0–1 месяц)">
                <Text style={styles.paragraph}>
                    Мир размыт и состоит из черно-бело-серых пятен. Ребенок
                    может увидеть лишь крупные контрастные объекты, если они
                    находятся совсем близко — как лицо матери при кормлении.
                    Фокус слабый и удерживается лишь на долю секунды. Глаза
                    &quot;скачут&quot;, а зрение работает только на расстоянии
                    20–30 см — как будто у ребенка «туман перед глазами».
                    {'\n\n'}Глаза могут казаться &quot;косыми&quot; — это норма.
                    Лучше всего новорожденные реагируют на черно-белые узоры.
                </Text>
            </CollapsibleSection>

            <CollapsibleSection title="1 месяц">
                <Text style={styles.paragraph}>
                    Зрение всё ещё размытое, но появляются оттенки серого.
                    Контрастные формы становятся немного четче. Ребенок дольше
                    фиксирует взгляд на лице или игрушке, особенно на знакомых.
                    Горизонтальное слежение становится плавнее. Цвета вроде
                    ярко-красного и зеленого могут начать различаться, но
                    черно-белое всё ещё интереснее.
                    {'\n\n'}Косоглазие всё ещё может проявляться, но становится
                    реже.
                </Text>
            </CollapsibleSection>

            <CollapsibleSection title="2 месяца">
                <Text style={styles.paragraph}>
                    Ребенок начинает различать черты лица — глаза, рот, брови.
                    Слежение становится увереннее: малыш может следить за
                    игрушкой, движущейся по кругу. Цвета — красный, желтый,
                    зеленый, синий — становятся узнаваемыми и привлекательными.
                    {'\n\n'}Координация глаз улучшается, косоглазие встречается
                    всё реже. Впервые может появиться осознанная улыбка при
                    зрительном контакте.
                </Text>
            </CollapsibleSection>

            <CollapsibleSection title="3 месяца">
                <Text style={styles.paragraph}>
                    Ребенок с любопытством разглядывает свои руки, одежду,
                    игрушки. Может хорошо фокусироваться на расстояниях от 20 см
                    до нескольких метров. Появляется аккомодация — способность
                    менять фокус.
                    {'\n\n'}Цветовосприятие улучшилось: оттенки становятся
                    разнообразнее. Координация &quot;глаз-рука&quot; позволяет
                    тянуться к игрушкам. Начинается развитие восприятия глубины.
                </Text>
            </CollapsibleSection>

            <CollapsibleSection title="4 месяца">
                <Text style={styles.paragraph}>
                    Зрение становится четче, насыщеннее по цвету. Ребенок
                    замечает мелкие детали, может различить человека или предмет
                    через всю комнату. Быстро следит за движущимися объектами —
                    даже за мячом или собакой.
                    {'\n\n'}Цветовое зрение почти на уровне взрослого.
                    Координация &quot;рука-глаз&quot; дает возможность точно
                    хватать предметы, часто одной рукой.
                </Text>
            </CollapsibleSection>

            <CollapsibleSection title="6 месяцев">
                <Text style={styles.paragraph}>
                    Зрение значительно острее — 20/50–20/100. Малыш видит четко,
                    различает формы и цвета. Хорошо развито восприятие глубины:
                    ребенок оценивает расстояние до предметов при ползании.
                    {'\n\n'}Отличная координация позволяет ловко хватать и
                    перекладывать предметы. Возникает понятие постоянства
                    объекта — малыш ищет упавшую игрушку, даже если её не видно.
                </Text>
            </CollapsibleSection>

            <CollapsibleSection title="1 год">
                <Text style={styles.paragraph}>
                    Почти взрослое зрение: острота до 20/25, хорошее восприятие
                    глубины, тонких цветов и мелких деталей. Малыш легко узнает
                    предметы, людей на расстоянии, &quot;читает&quot; картинки.
                    {'\n\n'}Развивается способность целенаправленно действовать:
                    указать пальцем, строить башню из кубиков, подражать
                    действиям.
                </Text>
            </CollapsibleSection>

            <CollapsibleSection title="Важно помнить">
                <Text style={styles.paragraph}>
                    Индивидуальные различия в развитии — это норма. Для раннего
                    развития зрения полезны:
                    {'\n\n'}• Контрастные игрушки (особенно черно-белые){'\n'}•
                    Общение лицом к лицу на расстоянии 20–30 см{'\n'}• Медленное
                    движение предметов перед глазами{'\n'}• Первое посещение
                    офтальмолога — в 6–12 месяцев, особенно при рисках (напр.,
                    косоглазие после 4 месяцев, отсутствие реакции на свет).
                    {'\n\n'}Первый год жизни — путь от черно-белой дымки до
                    объемного, цветного и полного деталей мира!
                </Text>
            </CollapsibleSection>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292E',
        padding: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 24,
    },
    wrapper: {
        marginBottom: 24,
        position: 'relative',
    },
    blobBackground: {
        position: 'absolute',
        top: 6,
        left: 6,
        right: -6,
        bottom: -6,
        backgroundColor: '#1f1f1f',
        borderTopLeftRadius: 48,
        borderBottomRightRadius: 72,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 16,
        zIndex: -1,
        transform: [{ rotate: '-2deg' }],
        opacity: 0.8,
    },
    sectionContainer: {
        backgroundColor: '#2E333A',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 60,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: '#3A3F47',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
    },
    icon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    content: {
        padding: 18,
        backgroundColor: '#2E333A',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#D1D5DB',
    },
})
