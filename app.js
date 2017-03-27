const helpers = {};

helpers.codeUpdate = () => {
  state.code = state.editor.getValue();

  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = state.baseHTML + state.code;

  const frame = document.querySelector('#preview iframe');
  const destDocument = frame.contentDocument;
  const srcNode = doc.documentElement;
  const newNode = destDocument.importNode(srcNode, true);

  destDocument.replaceChild(newNode, destDocument.documentElement);
  state.sandbox = frame.contentWindow;

  fittest.reset();
  state.tests();
  state.exerciseStats = fittest.stats();

  localforage.setItem(`${state.exercise.name}-stats`, state.exerciseStats);
  localforage.setItem(`${state.exercise.name}-code`, state.code);
};

helpers.fetchCode = (url) =>
  fetch(url).
    then((response) => response.text()).
    then((text) => text);

helpers.fetchExercise = () => {
  helpers.fetchCode(`code/${state.exercise.folder}/subject.html`).
    then((html) => {
      state.subject = html;
    });

  helpers.fetchCode(`code/${state.exercise.folder}/explanation.html`).
    then((html) => {
      state.explanation = html;
    });

  Promise.all([
    helpers.fetchCode(`code/${state.exercise.folder}/code.html`),
    localforage.getItem(`${state.exercise.name}-code`),
    helpers.fetchCode(`code/${state.exercise.folder}/tests.js`)
  ]).then((values) => {
    state.originalCode = values[0];
    state.code = values[1] || values[0];
    state.editor.setValue(state.code);

    state.tests = new Function(values[2]);

    helpers.codeUpdate();
  });
};

helpers.fetchJSON = (url) =>
  fetch(url).
    then((response) => response.json()).
    then((json) => json);

helpers.getTOCContent = (exercises) => {
  return exercises.reduce((acc, ex) => {
    (acc[ex.group] = acc[ex.group] || []).push(ex);
    return acc;
  }, {});
};

helpers.setEditorHandlers = (editor) => {
  editor.onKeyUp(() => {
    helpers.codeUpdate();
  });
};

helpers.setExercise = (index) => {
  state.exercise = state.exercises[index];
  state.exerciseIndex = index;
  state.baseHTML = state.exercise.baseHTML || '';

  localforage.setItem('last-exercise', index);

  helpers.fetchExercise();
};

helpers.initEditor = () => {
  require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.8.3/min/vs' }});

  window.MonacoEnvironment = {
    getWorkerUrl: (workerId, label) => 'monaco-editor-worker-loader-proxy.js'
  };

  require(['vs/editor/editor.main'], () => {
    state.editor = monaco.editor.create(document.getElementById('code'), {
      scrollBeyondLastLine: false,
      language: 'html',
      tabCompletion: true,
      value: ''
    });

    state.editor.getModel().updateOptions({ tabSize: 2 });

    localforage.getItem('last-exercise').
      then((lastExercise) => {
        const index = lastExercise === null ? 0 : lastExercise;
        helpers.setExercise(index);
      });

    helpers.setEditorHandlers(state.editor);
  });
};

// Vue code here
const state = {
  baseHTML: '',
  code: '',
  completedExercises: 0,
  exercise: null,
  exercises: [],
  exerciseStats: null,
  explanation: '',
  sandbox: null,
  subject: '',
  toc: {
    content: {},
    open: false
  }
};

const app = new Vue({
  el: '#app',
  data: state,
  computed: {
    completedExercises: () => {
      return 1;
    },
    exercisePercentage() {
      if (!this.exerciseStats) {
        return null;
      }

      return this.completeness(
        this.exerciseStats.ok / this.exerciseStats.total * 100);
    }
  },
  watch: {
    exercisePercentage: () => {
      const promises = [];
      let completed = 0;

      state.exercises.forEach((exercise) => {
        if (exercise.name !== state.exercise.name) {
          promises.push(localforage.getItem(`${exercise.name}-stats`));
        } else {
          promises.push(state.exerciseStats);
        }
      })

      Promise.all(promises).
        then((values) => {
          values.filter((stat) => stat).forEach((stat) => {
            if (stat.ok === stat.total) {
              completed++;
            }
          });

          state.completedExercises = completed;
        });
    }
  },
  created: () => {
    helpers.initEditor();
    helpers.fetchJSON('exercises.json').
      then((json) => {
        state.exercises = json.exercises;
        state.toc.content = helpers.getTOCContent(state.exercises);
      });
  },
  methods: {
    checkTOC: () => {
      if (state.toc.open) {
        state.toc.open = false;
      }
    },
    completeness: (value) => {
      if (value === parseInt(value)) {
        return value;
      }

      return value.toFixed(2);
    },
    load: (ex) => {
      for (let i = 0; i < state.exercises.length; i++) {
        if (ex.name === state.exercises[i].name) {
          helpers.setExercise(i);

          state.toc.open = false;

          break;
        }
      }
    },
    resetCode: () => {
      state.editor.setValue(state.originalCode);

      helpers.codeUpdate();
    },
    toggleTOC: () => {
      state.toc.open = !state.toc.open;
    }
  }
});
