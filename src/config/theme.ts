import { StyleFunctionProps, ThemeConfig, defineStyle, defineStyleConfig, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// 自定义变体
const brandPrimary = defineStyle({
  background: 'transparent',
  color: 'primary',
  border: '1px solid',
  fontWeight: 'normal',
});

const Button = defineStyleConfig({
  variants: { brandPrimary },
  baseStyle: {
    borderColor: 'transparent',
    fontFamily: 'SF Pro Text,sans-serif',
    textColor: 'base', // 按钮文字默认颜色
    borderRadius: '4px', // 按钮圆角
    fontWeight: 'medium',
    fontSize: '14px',
    hover: {
      bg: '#F1B71B',
    },
    // _hover: {
    //   bg: '#F1B71B',
    // },
  },
});

// 输入框
const Input = defineStyleConfig({
  baseStyle: {
    textColor: 'secondary', // 按钮文字默认颜色
    fontWeight: 'medium',
    fontSize: '12px',
    focusBorderColor: 'primary',
    errorBorderColor: 'error',
    borderWidth: '1px',
    borderColor: 'transparent',
    boxSizing: 'border-box',
  },
});

// 单选框主题样式修改
const Radio = defineStyleConfig({
  baseStyle: {
    control: {
      _checked: {
        background: '#F1B71B', // 选中背景色
        borderColor: '#F1B71B', // 选中边框色
      },
    },
  },
});

const Drawer = defineStyleConfig({
  // parts: ['drawerContent', 'drawerBody'],
  baseStyle: {
    fontFamily: 'SF Pro Text,sans-serif',
    roundedTop: '16px',

    dialog: {
      background: 'transparent',
      roundedTop: '16px',
      pt: '0px',
      px: '0px',
      width: '100%',
      mx: 'auto',
      maxHeight: '80vh',
    },
    header: {
      width: '100%',
      mx: 'auto',
      background: 'pageBgColor',
      roundedTop: '16px',
      px: 0,
      boxSizing: 'border-box',
    },
    body: {
      width: '100%',
      mx: 'auto',
      background: 'pageBgColor',
      px: '20px',
      pt: '24px',
      pb: '40px',
      boxSizing: 'border-box',
    },
    closeButton: {
      bg: 'tipBg',
      borderRadius: 'full',
      mt: '10px',
      mr: '12px',
      width: '7',
      height: '7',
      border: 0,
    },
  },
});

const Modal = defineStyleConfig({
  // parts: ['drawerContent', 'drawerBody'],
  baseStyle: {
    fontFamily: 'SF Pro Text,sans-serif',
    width: 'auto',
    dialog: {
      // background: '#17181B',
      paddingBottom: '24px',
      pt: '24px',
      px: '12px',
      boxShadow: 'none',
      overflow: 'hidden',
    },
    header: {
      position: 'relative',
      // maxWidth: '468px',
      // width: '100%',
      // mx: 'auto',
      // borderTopRadius: '12px',
      fontWeight: 'medium',
      fontSize: 'base',
      border: 0,
      pt: '18px',
      padding: 0,
    },
    body: {
      // maxWidth: '468px',
      // width: '100%',
      // mx: 'auto',
      // bg: 'secondaryBgColor',
      // px: '20px',
      // pt: '40px',
      // pb: '24px',
      // color: 'secondary',
      borderRadius: '12px',
      marginInline: 0,
      px: 0,
      py: 4,
    },
    overlay: {
      // maxWidth: '468px',
      // width: 'full',
      // margin: '0 auto',
    },
    // closeButton: {
    //   border: 0,
    //   bg: 'transparent',
    //   // borderRadius: 'full',
    //   mt: '24px',
    //   mr: '16px',
    //   width: '7',
    //   height: '7',
    //   color: 'closeButtonColor',
    // },
  },
});

const Progress = defineStyleConfig({
  // baseStyle: {
  //   filledTrack: {
  //     bg: 'primary',
  //   },
  //   track: {
  //     bg: 'rgba(159, 232, 114,0.2)',
  //   },
  // },
  // // 另外一种样式
  // sizes: {
  //   lg: {
  //     filledTrack: {
  //       bg: '#173320',
  //     },
  //     track: {
  //       bg: '#CED2CD',
  //     },
  //   },
  // },
});

const Textarea = defineStyleConfig({
  baseStyle: {
    position: 'relative',
    resize: 'none',
    focusBorderColor: 'primary',
    border: 'none',
    textarea: {
      border: 'none',
    },
  },
});

const Tabs = defineStyleConfig({
  variants: {
    'filter-round': {
      tab: {
        borderRadius: '4px',
        width: '84px',
        height: '32px',
        color: 'baseDesc',
        fontSize: 'xs',
        mr: '3',
        border: 0,
        _last: {
          mr: 0,
        },
        _selected: {
          bg: 'primary',
          color: '#fff',
          fontWeight: 'medium',
        },
      },
    },
  },
});

// 默认主题及是否启动系统主题
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const Theme = extendTheme({
  fonts: {
    body: 'SF Pro Text, sans-serif', // 修改 body 字体
    heading: 'SF Pro Text, sans-serif', // 修改 heading 字体
    level: 'HONORSansArabicUI',
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        fontFamily: 'SF Pro Text, sans-serif',
        color: mode('#333333', '#fff')(props),
        bg: mode('#fff', '#1C1E28')(props),
        lineHeight: 'base',
        width: '100%',
        margin: '0 auto',
        fontSize: '16px',
      },
    }),
  },
  semanticTokens: {
    colors: {
      pageBgColor: {
        default: '#F6F7FD',
        _dark: '#1C1E28',
      },
      base: {
        default: '#333333',
        _dark: '#ffffff',
      }, // 主字体色
      primarySecondary: {
        default: '#ffffff',
        _dark: '#2E3039',
      }, // 主题次要色
      lineColor: {
        default: 'rgba(153, 153, 153, 0.1)',
        dark: '#393C47',
      },
      baseDesc: {
        default: '#333333',
        _dark: '#ABB3C2', // 主体描述色
      },
      baseDesc1: {
        default: '#999999',
        _dark: '#ABB3C2',
      },
      baseDesc2: {
        default: '#666666',
        _dark: '#ABB3C2',
      },
      secondaryDesc: {
        default: '#999999',
        _dark: '#818A9B',
      }, // 次字体描述色
      closeButtonColor: {
        default: '#333333',
        _dark: '#878FA1',
      },
      bgLightColor: {
        default: 'rgba(153, 153, 153, 0.30)',
        _dark: '#2C2E37',
      },
      placeholderColor: {
        default: '#666666',
        _dark: '#ADBAD1',
      },
      passwordModalBg: {
        default: '#FFFFFF',
        _dark: '#262935',
      },
      secondaryBgColor: {
        default: '#ffffff',
        _dark: '#1C1E28',
      },
      BindInputBorderColor: {
        default: 'rgba(153, 153, 153, 0.30)',
        _dark: '#373A3E',
      },
      incomeTimeBoxBgColor: {
        default: '#E8E8ED',
        _dark: '#2E3039',
      },
      incomeListItemBgColor: {
        default: '#ffffff',
        _dark: '#1F212A',
      },
      bgDeepColor: {
        default: '#ffffff',
        _dark: '#21232E',
      },
      primarySecondaryBgColor: {
        default: '#F6F7FD',
        _dark: '#2E3039',
      },
      dividerBgColor: {
        default: 'rgba(153, 153, 153, 0.30)',
        _dark: '#373A3E',
      },
    },
  },
  colors: {
    rise: 'rgb(175, 223, 182)', // 涨
    fall: 'rgb(240, 148, 164)', // 跌
    secondary: '#9AA0AA',

    error: '#EF521D', // 错误色
    success: '#3BCCA0', //成功色
    primary: '#F1B71B', // 主题色 例如按钮gr
    primaryText: '#F1B71B', // 主色字体色
    primaryHigh: '#FDBB59', // 主题头部色
    primaryDesc: '', // 主题描述色

    warning: '#EF521D', // 警告色
    pending: '#2967FF', // 待处理色
    purple: '#F19FF8', // 紫色
    borderDashed: '#393C47', // 虚线边框色
    borderDashedHigh: '#EBECED', // 虚线边框色亮色
    filterButtonBg: '#F8F8F8', // 筛选按钮背景色
    hoverButtonColor: '#F4CA42', // button 悬浮色
    activeButtonColor: '#C89111', // button 激活色
    marketCardColor: '#E4EFFF',
    // placeholder: '#DADDDB', // 表单提示色
    // FiledHelp: '#858C87', // 表单提示色
    // PinInputColor: '#173320',
    // qrCodeBg: '#F0F2EF',
    // inputBg: '#F5F5F3',
    // boxBg: '#EEEEEC',
    // tagBg: '#F1D900',
    // tagColor: '#826F00',
    // marketTipColor: '#819B89',
    secondaryAlpha: {
      100: 'rgba(28, 30, 40,0.1)',
      200: 'rgba(28, 30, 40,0.2)',
      300: 'rgba(28, 30, 40,0.3)',
      400: 'rgba(28, 30, 40,0.4)',
      500: 'rgba(28, 30, 40,0.5)',
      600: 'rgba(28, 30, 40,0.6)',
      700: 'rgba(28, 30, 40,0.7)',
      800: 'rgba(28, 30, 40,0.8)',
      900: 'rgba(28, 30, 40,0.9)',
    },
    primarySecondaryAlpha: {
      100: 'rgba(46, 48, 57,0.1)',
      200: 'rgba(46, 48, 57,0.2)',
      300: 'rgba(46, 48, 57,0.3)',
      400: 'rgba(46, 48, 57,0.4)',
      500: 'rgba(46, 48, 57,0.5)',
      600: 'rgba(46, 48, 57,0.6)',
      700: 'rgba(46, 48, 57,0.7)',
      800: 'rgba(46, 48, 57,0.8)',
      900: 'rgba(46, 48, 57,0.9)',
    },
    primaryAlpha: {
      100: 'rgba(241, 183, 27, 0.1)',
      200: 'rgba(241, 183, 27,0.2)',
      300: 'rgba(241, 183, 27,0.3)',
      400: 'rgba(241, 183, 27,0.4)',
      500: 'rgba(241, 183, 27,0.5)',
      600: 'rgba(241, 183, 27,0.6)',
      700: 'rgba(241, 183, 27,0.7)',
      800: 'rgba(241, 183, 27,0.8)',
      900: 'rgba(241, 183, 27,0.9)',
    },
    // PinInputColorAlpha: {
    //   100: 'rgba(23, 51, 32, 0.1)',
    //   200: 'rgba(23, 51, 32,0.2)',
    //   300: 'rgba(23, 51, 32,0.3)',
    //   400: 'rgba(23, 51, 32,0.4)',
    //   500: 'rgba(23, 51, 32,0.5)',
    //   600: 'rgba(23, 51, 32,0.6)',
    //   700: 'rgba(23, 51, 32,0.7)',
    //   800: 'rgba(23, 51, 32,0.8)',
    //   900: 'rgba(23, 51, 32,0.9)',
    // },
    // primaryTextAlpha: {
    //   100: 'rgba(58, 128, 80, 0.1)',
    //   200: 'rgba(58, 128, 80, 0.2)',
    //   300: 'rgba(58, 128, 80, 0.3)',
    //   400: 'rgba(58, 128, 80,0.4)',
    //   500: 'rgba(58, 128, 80,0.5)',
    //   600: 'rgba(58, 128, 80,0.6)',
    //   700: 'rgba(58, 128, 80,0.7)',
    //   800: 'rgba(58, 128, 80,0.8)',
    //   900: 'rgba(58, 128, 80,0.9)',
    // },
  },
  // layerStyles 图层样式
  layerStyles: {
    base: {
      bg: 'black.50',
      border: '2px solid',
      borderColor: 'gray.500',
    },
    selected: {
      bg: 'teal.500',
      color: 'teal.700',
      borderColor: 'orange.500',
    },
    fixedBottom: {
      boxSizing: 'border-box',
      position: 'fixed',
      left: '50%',
      bottom: 0,
      transform: 'translateX(-50%)',
      width: '100%',
      justifyContent: 'center',
      pt: '5',
      px: '5',
      pb: '8',
      bg: 'secondaryBgColor',
      zIndex: 999,
      boxShadow: '0px 4px 30px rgba(30, 107, 235, 0.12)',
    },
    flowFlexBetween: {
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '16px',
      mb: '24px',
    },
  },
  components: {
    // Button,
    Radio,
    Drawer,
    Input,
    Modal,
    Progress,
    Textarea,
    Tabs,
  },
  config,
});

export default Theme;
