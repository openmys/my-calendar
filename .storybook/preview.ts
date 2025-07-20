import type { Preview } from '@storybook/react-vite';
import '../src/styles/calendar.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      description: {
        component: 'ProseMirror 스타일 헤드리스 캘린더 라이브러리',
      },
    },
    options: {
      storySort: {
        order: ['소개', '캘린더', '플러그인', '헤드리스 예시', 'API 문서'],
      },
    },
  },
  globalTypes: {
    theme: {
      description: '테마 선택',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
