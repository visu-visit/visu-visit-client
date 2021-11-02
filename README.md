# Visu-visit | 웹 히스토리 시각화 웹사이트

## Contents

- [Visu-visit | 웹 히스토리 시각화 웹사이트](#visu-visit--웹-히스토리-시각화-웹사이트)
  - [Contents](#contents)
  - [프로젝트 동기](#프로젝트-동기)
  - [프로젝트 소개](#프로젝트-소개)
    - [작업 기간](#작업-기간)
    - [주요 기능](#주요-기능)
    - [배포 주소](#배포-주소)
  - [프로젝트 기술 스택](#프로젝트-기술-스택)
  - [스택 선정 이유](#스택-선정-이유)
    - [Typescript](#typescript)
    - [D3](#d3)
    - [Redux](#redux)
    - [Better-sqlite3](#better-sqlite3)
    - [MongoDB](#mongodb)
  - [프로젝트를 진행하며 생긴 이슈들](#프로젝트를-진행하며-생긴-이슈들)
    - [사용자의 웹 히스토리에 접근하는 방식](#사용자의-웹-히스토리에-접근하는-방식)
    - [D3, 리액트, 타입스크립트를 함께 사용하기](#d3-리액트-타입스크립트를-함께-사용하기)
    - [프라이버시와 데이터를 저장하는 시점](#프라이버시와-데이터를-저장하는-시점)

## 프로젝트 동기

무언가 검색하고 공부하기 위해 브라우저의 탭을 많이 띄워두고 나중에 한꺼번에 지우거나, 이따금 쌓인 브라우저의 방문 기록을 삭제하고는 했습니다. 쌓인 브라우저의 히스토리 기록이 의미 없이 사라지는 게 아까웠고, 그 기록을 보는 이로 하여금 의미 있도록 시각화하면 좋겠다 생각해 웹 히스토리 시각화 사이트를 개발하게 되었습니다.

## 프로젝트 소개

### 작업 기간

- 기획 2021.09.27 ~ 2021.10.03 (1주)
- 개발 2021.10.04 ~ 2021.10.15 (2주)

### 주요 기능

- 브라우저의 히스토리 파일을 업로드하면 그 파일의 데이터를 토대로 웹 방문 기록을 방향 그래프로 만들어 보여줍니다.
- 사용자의 로컬 컴퓨터에 저장된 브라우저 히스토리 파일을 업로드하면 그것을 방향 그래프로 보여줍니다. 이때 그래프 전체를 드래그시켜 이동하거나, 줌인, 줌아웃이 가능합니다.
    
    ![main](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ca5a8a94-cd38-4892-a588-91841f3065a5/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211102%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211102T130848Z&X-Amz-Expires=86400&X-Amz-Signature=12cf987de896373d3f2347830d07ca70fbb3b1586a37e73422bc4cf25c82c7ca&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)
    
- 특정 기간이나 특정 이름이 포함된 도메인의 방문 기록을 필터링하여 볼 수 있습니다.
    
    ![instruction-filter.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8614af41-d332-4825-901a-b91b641686ca/instruction-filter.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211102%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211102T130942Z&X-Amz-Expires=86400&X-Amz-Signature=9e81e669a8bac5c38974ec1648401759fe63d1d649ec7a69abfb9e61c4b44eaf&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22instruction-filter.gif%22)
    
- 노드를 드래그하여 고정시키거나, 더블클릭하여 고정을 해제할 수 있습니다.
    
    ![instruction-double-click.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e2ea215e-62e2-4e9d-b48d-00ce96cd0c49/instruction-double-click.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211102%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211102T130954Z&X-Amz-Expires=86400&X-Amz-Signature=6ef3a436afb52924e7daab568cdf6a4dedc56f6b628ca85beea1ddc49ec3635c&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22instruction-double-click.gif%22)
    
- 노드를 삭제할 수 있습니다.
    
    ![instruction-delete.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/9c4f199d-60b4-4dd3-9200-3625c82a9075/instruction-delete.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211102%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211102T131009Z&X-Amz-Expires=86400&X-Amz-Signature=97903498e2c384a7664e0d86d1c0e0f38954a29e7167fa5d50871e65cea3ed9b&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22instruction-delete.gif%22)
    
- 노드를 우클릭하면 해당 노드(도메인)에 관련된 상세 정보를 볼 수 있습니다. 상세 정보 화면에서 노드의 색깔을 바꾸거나 노드에 메모를 남길 수 있습니다.
    
    ![instruction-detail.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c8a6e95d-7bea-4e71-a940-2ab3dcf9e68d/instruction-detail.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211102%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211102T131020Z&X-Amz-Expires=86400&X-Amz-Signature=9e2a71073bfaff3852fccb47f3524b9ea6cfd4e7232f9f744fc2d387b0cbc324&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22instruction-detail.gif%22)
    
- 지금까지 편집했던 그래프의 모양과 정보를 서버 저장하고 url로 불러올 수 있습니다.
    
    ![instruction-save-share.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8e6bb971-3a87-46d0-9610-1d8e84bb9fbe/instruction-save-share.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211102%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211102T131034Z&X-Amz-Expires=86400&X-Amz-Signature=b19ea99bce33663f70a50c6af01e40e9d853aaf6c6166503bb2b1be2b2b61954&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22instruction-save-share.gif%22)


### 배포 주소

- https://www.visu-visit.com

## 프로젝트 기술 스택

- Common(Typescript)
- FrontEnd(React, D3, Redux, Styled-components, Netlify)
- BackEnd(Node, Express, Mongoose, Better-sqlite3, AWS Elastic Beanstalk)

## 스택 선정 이유

### Typescript

Typescript는 이번 프로젝트에서 처음 사용하는 것이기 때문에 진입 장벽이 있을 것이라 생각했습니다. 하지만 Typescript를 사용한 정적 타이핑으로 런타임 에러를 줄이고 디버깅, 장기적으로는 유지 보수를 쉽게 하기 위해 선택했습니다. 실제로 개발 초기에는 미숙한 사용으로 개발 속도가 느렸었지만 점점 사용이 익숙해져서 기능 구현에는 문제가 적었습니다.

### D3

D3는 많은 데이터를 자신이 원하는대로 시각화하기에 유용하고 오래전부터 관리된 신뢰도 높은 라이브러리라고 생각했습니다. 기획 초기 직접 방향 그래프를 구현해보겠다 생각했지만, 필요한 기능들을 생각했을 때 직접 구현하면 2주라는 개발 기간 안에 구현이 불가능할 것이라 판단했습니다. 제가 사용하려는 React와 함께 쓸 수 있는지 간단히 확인했고, 제가 구현할 방향 그래프 관련해 참고할 만한 레퍼런스도 있었기에 선택했습니다.

### Redux

기획 시 웹 히스토리 노드의 위치가 빈번하게 수정되고, 노드 데이터를 여러 컴포넌트에서 사용할 것이라 예상했습니다. 따라서 전역 상태를 관리하기 위해 Redux와 React의 context API 중 어떤 것을 사용할지 선택해야 했습니다. 기획단계에서는 Redux의 정해진 형식과 익숙함으로 빠른 개발을 도모하고 logger와 같은 미들웨어, toolkit에 내장된 immer를 이용하기 위해 Redux를 사용하기로 결정했습니다.

### Better-sqlite3

크롬의 브라우저 히스토리는 sqlite3 형식으로 저장되기 때문에, 사용자가 히스토리 파일을 업로드하면 해당 DB 파일을 변환하기 때문에 sqlite를 다루는 라이브러리를 사용해야 했습니다. Sqlite를 다루는 라이브러리로 [sqlite3](https://github.com/mapbox/node-sqlite3)와 [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3)가 있었습니다. 프로젝트에서 sqlite3 파일을 변환하는 작업은 업로드 순간에만 필요했기 때문에, select 쿼리문의 속도가 중요했습니다. 이 면에서 sqlite3에 비해 better-sqlite3가 명백히 성능이 좋았기 때문에 better-sqlite3을 선택하게 됐습니다.

### MongoDB

크롬의 브라우저 히스토리는 관계형 DB(sqlite3)로 저장되기 때문에 아예 프로젝트의 DB를 sqlite3로 사용해야 하나 고민했습니다. 하지만 프로젝트 기획 상으로 필요한 데이터는 초기 파일을 업로드했을 때, sqlite3의 쿼리문을 단 한 번만 작성하면 얻을 수 있었습니다. 또, 프로젝트에서 다룰 그래프 데이터는 방문 기록 중심으로 만들어지기 때문에 다른 데이터 컬렉션과 관계할 일이 없고 방문 기록의 양적인 확장만 고려하면 됐습니다. 따라서 굳이 DB를 sqlite3으로 관리할 필요가 없다고 판단했고 mongoDB를 사용하게 됐습니다.

## 프로젝트를 진행하며 생긴 이슈들

### 사용자의 웹 히스토리에 접근하는 방식

프로젝트 가장 첫 문제는 '사용자의 히스토리 파일에 어떻게 접근할 것인가' 였습니다. 최근 구현된 브라우저 [File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) 를 사용해 사용자의 브라우저 파일이 저장되어 있는 경로에 직접 접근할 수 있는지 알아봤습니다. 하지만 제가 조사한 선에서는 지정 경로에 파일을 저장하고 수정하는 것은 가능하지만 원래 있는 파일을 읽는 것은 불가능했습니다. 따라서 사용자가 직접 파일을 업로드할 수밖에 없었는데, 최대한 사용자가 편하게 히스토리 파일의 위치를 알고 접근할 수 있도록 파일을 업로드 하는 방법을 설명하는 화면을 만들었습니다.

### D3, 리액트, 타입스크립트를 함께 사용하기

1. 리액트와 D3는 잘 어울리는가?
    
    기본적으로 D3도 리액트도 DOM를 다루기 때문에 두 라이브러리의 작동 방식을 잘 아는 것이 중요했습니다. 일단 리액트의 가상 DOM을 다루는 방식을 유지하기 위해 D3 라이브러리는 리액트의 useRef에 의해 생성된 객체를 D3에 전달해서 D3가 직접 DOM을 조작하는 것이 아니라 리액트를 통해서 조작하게끔 했습니다.
    
2. D3와 타입스크립트 제네릭
    
    방향 그래프가 그려지는 SVG에 줌인, 줌아웃, 드래그 기능을 넣고 싶었는데 계속 컴파일 에러가 발생했습니다. 정확한 제네릭을 정의해야 했는데 처음에는 타입스크립트를 사용한 레퍼런스가 부족했고, D3가 구체적으로 어떻게 작동하는지 알지 못했기 때문에 에러를 잡아내는데 시간이 많이 소요됐습니다. D3의 타입 정의 문서를 읽어가면서 처음 DOM 선택부터 타입을 구체적으로 전달한 결과, 의도한 기능을 구현해낼 수 있었습니다. 이 과정에서 D3에 대한 이해는 물론이고 다양한 타입에 대응하고 예외로 인한 버그를 방지하는 타입스크립트의 제네릭 기능을 여실히 느낄 수 있어서 좋았습니다.
    

### 프라이버시와 데이터를 저장하는 시점

웹 히스토리 데이터는 사용자에 따라 민감한 정보일 수 있기 때문에 사용자가 웹사이트에 자신의 히스토리 파일을 업로드했을 때 자신의 프라이버시가 자동으로 저장되고 노출된다는 우려가 있을 수 있었습니다. 그리고 서버에 굳이 데이터를 보관하는 게 아니라 단순히 그래프만 보고 싶은 사용자가 있을 수 있다고 생각했습니다. 그래서 초기에 히스토리 파일을 업로드하자마자 데이터베이스에 데이터를 저장하는 방식이었지만, 최종적으로는 "서버는 단순히 히스토리 파일을 가공한 그래프 객체를 클라이언트에 전달하는 방식으로 구현했습니다.
