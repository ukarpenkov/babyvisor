// CameraComponent.js
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

/**
 * Компонент CameraComponent для отображения вида с камеры с определенными визуальными настройками.
 *
 * Обратите внимание: многие из запрошенных эффектов (размытие, контраст, насыщенность)
 * требуют постобработки. В react-native-vision-camera это реализуется через
 * Frame Processors. Этот компонент использует только базовые пропсы для
 * максимального приближения к желаемому результату.
 */
const CameraComponent = () => {
  // Запрос разрешений на использование камеры
  const { hasPermission, requestPermission } = useCameraPermission();
  // Выбор устройства камеры (здесь используется задняя камера)
  // Для эффекта "малой глубины резкости" можно было бы попытаться выбрать
  // телефото-объектив ('telephoto'), если он доступен, так как он физически
  // создает более сильное размытие фона.
  const device = useCameraDevice('back');

  // Запрашиваем разрешение, если его еще нет
  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // Отображение индикатора загрузки, пока устройство не готово или нет разрешений
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Запрос разрешений...</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.text}>Загрузка камеры...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true} // Включаем возможность делать фото

        // --- НАСТРОЙКИ ЭФФЕКТОВ ---

        // 1. Размытие (малая глубина резкости, f/1.8 и сильное боке):
        // ПРИМЕЧАНИЕ: Управление диафрагмой (f-stop) напрямую невозможно.
        // Эффект "боке" (портретный режим) достигается программно и обычно
        // применяется при съемке фото, а не на превью. Выбор 'telephoto'
        // объектива может помочь, но это аппаратная особенность.

        // 2. Сильное размытие (низкий sharpness, blur фильтр):
        // ПРИМЕЧАНИЕ: Этот эффект невозможно применить через базовые пропсы.
        // Для этого необходим Frame Processor, который бы применял
        // фильтр размытия к каждому кадру.

        // 3. Уменьшение контраста и 4. Удаление цвета (черно-белый):
        // ПРИМЕЧАНИЕ: Как и размытие, эти эффекты (контраст, насыщенность)
        // являются классическими фильтрами постобработки и требуют
        // реализации через Frame Processor.

        // 5. Пересвеченные или затемненные участки (highlights + shadows):
        // Мы можем управлять общей экспозицией, чтобы сделать изображение темнее или светлее.
        // Значение может быть от `minExposure` до `maxExposure` устройства.
        // Например, `-1` сделает изображение темнее.
        exposure={-1}

        // 6. Дрожание камеры (motion blur):
        // Чтобы симулировать "дрожание" и добавить размытие в движении,
        // мы можем отключить стабилизацию видео. Это сделает картинку менее плавной.
        videoStabilizationMode={'off'}

        // Для сильного эффекта размытия при движении в условиях низкой освещенности
        // можно было бы включить режим ночной съемки, но это также зависит от устройства.
        // lowLightBoost={device.supportsLowLightBoost}
      />
      <View style={styles.overlay}>
        <Text style={styles.infoText}>
          Для эффектов размытия, контраста и обесцвечивания необходимы Frame Processors.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  infoText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default CameraComponent;

