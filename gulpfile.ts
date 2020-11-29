const replace = require('gulp-replace');
const gulp = require('gulp');
const { exec } = require('child_process');
import { experience, skill, education, cvItem, personal } from './generator';
import cv from './cv.json';
const outputDir = 'output'
const resumeFinalDir = '../ethanmsmith.github.io/'

gulp.task('personal', function () {
  return gulp.src(['cv.tex'])
    .pipe(replace('% BASICS', personal(cv.basics)))
    .pipe(replace('FOOTER', `{${cv.basics.name}~~~·~~~Curriculum Vitae}`))
    .pipe(gulp.dest(`${outputDir}/`));
});

gulp.task('experiences', () => {
  return gulp.src(['cv/experience.tex'])
    .pipe(replace('EXPERIENCES', cv.work.map(workItem =>
      experience(workItem.position, workItem.company, workItem.location, workItem.startDate, workItem.endDate, workItem.summary, workItem.highlights ? workItem.highlights.map((highlight): cvItem =>
        ({ text: highlight })) : [])).join('\n')))
    .pipe(gulp.dest(`${outputDir}/cv/`));
});

gulp.task('education', () =>
  gulp.src(['cv/education.tex'])
    .pipe(replace('EDUCATION', education(cv.education[0].area, cv.education[0].institution, cv.education[0].location, cv.education[0].startDate, cv.education[0].endDate, cv.education[0].courses)))
    .pipe(gulp.dest(`${outputDir}/cv/`))
);

gulp.task('skills', () => gulp.src(['cv/skills.tex']).pipe(replace('SKILLS', cv.skills.map(skillItem =>
  skill(skillItem.name, skillItem.keywords)).join('\n')))
  .pipe(gulp.dest(`${outputDir}/cv/`))
);

gulp.task('summary', () =>
  gulp.src(['cv/summary.tex']).pipe(replace('SUMMPARAGRAPH', cv.basics.summary))
    .pipe(gulp.dest(`${outputDir}/cv/`))
);

gulp.task('latex', (cb: any) => {
  // gulp.src(['awesome-cv.cls']).pipe(gulp.dest(`${outputDir}/`));
  // gulp.src(['fontawesome.sty']).pipe(gulp.dest(`${outputDir}/`));
  exec(`cp -f awesome-cv.cls ${outputDir}/;cp -f fontawesome.sty ${outputDir}/;cp -R fonts ${outputDir}/fonts;cd ${outputDir}/;`, (err: any, stdout: any, stderr: any) => {
    if (err) {
      // node couldn't execute the command
      console.log("ERROR: Some shit happened. Go fix it. Line: 46?");
    }
    else {
      console.log("SUCCESS: Copied supporting files to " + outputDir);
      exec(`xelatex cv.tex;`, (err: any, stdout: any, stderr: any) => {
        console.log("Start compile")
        if (err) {
          // node couldn't execute the command
          console.log("ERROR:");
        }
        else {
          console.log("SUCCESS: LaTex command completed succesfully");
          gulp.src(`${outputDir}/cv.pdf`).pipe(gulp.dest(resumeFinalDir));
          console.log("SUCCESS: Resume compiled and saved in final location");
          cb();
        }
        console.log("Outside of if")
      });
    }
  });
});

gulp.task('default', gulp.series('personal', 'summary', 'experiences', 'education', 'skills', 'latex'));