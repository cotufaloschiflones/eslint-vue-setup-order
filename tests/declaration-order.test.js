import { RuleTester } from "eslint";
import rule from "../lib/rules/declaration-order.js";
import config from "./config.js";
import {ERROR_MESSAGE} from "../lib/constants.js";

const ruleTester = new RuleTester(config);

const validCode = `
<script setup>
const emits = defineEmits();

const hello = "Hello World!";

const count = ref(0);
const msg = ref("");

onBeforeMount(() => {
  console.log("onBeforeMount");
});

const changeMsg = () => {};
function handleClick() {
  emits("click");
}
</script>
`;

const invalidCode = `
<script setup>
const hello = "Hello World!";
const changeMsg = () => {};
const emits = defineEmits();
onBeforeMount(() => {
  console.log("onBeforeMount");
});
function handleClick() {
  emits("click");
}
const count = ref(0);
const msg = ref("");
</script>
`;

const ignoreNormalScript = `
<script>
const blah = () => {}
const doNotReorderMe = true;
</script>
<script setup>
const emits = defineEmits();

const hello = "Hello World!";

const changeMsg = () => {};
</script>
`;

const fixedCode = `
<script setup>
const emits = defineEmits();

const hello = "Hello World!";

const count = ref(0);
const msg = ref("");

onBeforeMount(() => {
  console.log("onBeforeMount");
});

const changeMsg = () => {};
function handleClick() {
  emits("click");
}
</script>
`;

const customValidCode = `
<script setup>
const props = defineProps();

const hello = "Hello World!";
</script>
`;

const customInvalidCode = `
<script setup>
const hello = "Hello World!";
const props = defineProps();
</script>
`;

const customFixedCode = `
<script setup>
const props = defineProps();

const hello = "Hello World!";
</script>
`;

const customLifecycleValidCode = `
<script setup>
onMounted(() => {
  console.log("onMounted");
});
onBeforeMount(() => {
  console.log("onBeforeMount");
});
</script>
`;

const customLifecycleInvalidCode = `
<script setup>
onBeforeMount(() => {
  console.log("onBeforeMount");
});
onMounted(() => {
  console.log("onMounted");
});
</script>
`;

const customLifecycleFixedCode = `
<script setup>
onMounted(() => {
  console.log("onMounted");
});
onBeforeMount(() => {
  console.log("onBeforeMount");
});
</script>
`;

const composableAliasesValidCode = `
<script setup>
const emits = defineEmits();

const count = ref(0);

const store = storeToRefs();
</script>
`;

const composableAliasesInvalidCode = `
<script setup>
const store = storeToRefs();
const count = ref(0);
const emits = defineEmits();
</script>
`;

const composableAliasesFixedCode = `
<script setup>
const emits = defineEmits();

const count = ref(0);

const store = storeToRefs();
</script>
`;

const spaceBetweenItemsValidCode = `
<script setup>
const emits = defineEmits();

const hello = "Hello World!";

const count = ref(0);

const msg = ref("");

const changeMsg = () => {};

function handleClick() {
  emits("click");
}
</script>
`;

const spaceBetweenItemsInvalidCode = `
<script setup>
const hello = "Hello World!";
const changeMsg = () => {};
const emits = defineEmits();
const count = ref(0);
const msg = ref("");
function handleClick() {
  emits("click");
}
</script>
`;

const spaceBetweenItemsFixedCode = `
<script setup>
const emits = defineEmits();

const hello = "Hello World!";

const count = ref(0);

const msg = ref("");

const changeMsg = () => {};

function handleClick() {
  emits("click");
}
</script>
`;

const functionBodySpacingValidCode = `
<script setup>
const emits = defineEmits();

function handleClick() {
  if (true) {

    emits("click");
  }
}
</script>
`;

const functionBodySpacingInvalidCode = `
<script setup>
function handleClick() {
  if (true) {

    emits("click");
  }
}

const emits = defineEmits();
</script>
`;

const functionBodySpacingFixedCode = `
<script setup>
const emits = defineEmits();

function handleClick() {
  if (true) {

    emits("click");
  }
}
</script>
`;

const multilineComposableSpacingValidCode = `
<script setup>
const state = useFeature({
  top: true,

  bottom: false,
});
</script>
`;

ruleTester.run("declaration-order", rule, {
  valid: [
    {
      code: validCode,
    },
    {
      code: ignoreNormalScript,
    },
    {
      code: customValidCode,
      options: [
        {
          sectionOrder: ["defineProps", "plainVars"],
        },
      ],
    },
    {
      code: customLifecycleValidCode,
      options: [
        {
          sectionOrder: ["lifecycle"],
          lifecycleOrder: {
            onMounted: 0,
            onBeforeMount: 1,
          },
        },
      ],
    },
    {
      code: composableAliasesValidCode,
      options: [
        {
          composableAliases: ["storeToRefs"],
        },
      ],
    },
    {
      code: spaceBetweenItemsValidCode,
      options: [
        {
          spaceBetweenItems: true,
        },
      ],
    },
    {
      code: functionBodySpacingValidCode,
    },
    {
      code: multilineComposableSpacingValidCode,
    },
  ],
  invalid: [
    {
      code: invalidCode,
      output: fixedCode,
      errors: [
        {
          message:
           ERROR_MESSAGE,
        },
      ],
    },
    {
      code: customInvalidCode,
      output: customFixedCode,
      options: [
        {
          sectionOrder: ["defineProps", "plainVars"],
        },
      ],
      errors: [
        {
          message:
           ERROR_MESSAGE,
        },
      ],
    },
    {
      code: customLifecycleInvalidCode,
      output: customLifecycleFixedCode,
      options: [
        {
          sectionOrder: ["lifecycle"],
          lifecycleOrder: {
            onMounted: 0,
            onBeforeMount: 1,
          },
        },
      ],
      errors: [
        {
          message:
           ERROR_MESSAGE,
        },
      ],
    },
    {
      code: composableAliasesInvalidCode,
      output: composableAliasesFixedCode,
      options: [
        {
          composableAliases: ["storeToRefs"],
        },
      ],
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: spaceBetweenItemsInvalidCode,
      output: spaceBetweenItemsFixedCode,
      options: [
        {
          spaceBetweenItems: true,
        },
      ],
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: functionBodySpacingInvalidCode,
      output: functionBodySpacingFixedCode,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
  ],
});
