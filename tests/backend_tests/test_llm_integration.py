import pytest
import os
from unittest.mock import MagicMock, patch
from backend.llm_integration import (
    CVTailorResponse,
    get_tailored_results,
    system_prompt,
)


def test_get_tailored_results_unit(mock_cv_response):
    cv_input = "Python Developer with 3 years of experience..."
    job_input = "Looking for a Senior Python Developer..."

    with patch("backend.llm_integration.model") as mock_model:
        mock_model.invoke.return_value = mock_cv_response

        result = get_tailored_results(cv_input, job_input)

        mock_model.invoke.assert_called_once()

        args, _ = mock_model.invoke.call_args
        messages = args[0]

        assert messages[0] == ("system", system_prompt)
        assert cv_input in messages[1][1]
        assert job_input in messages[1][1]

        assert isinstance(result, CVTailorResponse)
        assert result.status == "success"
        assert result.match_score == 85
        assert len(result.recommendations) == 2


@pytest.mark.integration
@pytest.mark.skipif(
    "fake" in os.getenv("GOOGLE_API_KEY", "") or not os.getenv("GOOGLE_API_KEY"),
    reason="Missing or fake GOOGLE_API_KEY. Skipping real API call.",
)
def test_get_tailored_results_integration():
    cv_input = "Software Engineer with knowledge of Python, Docker, and SQL."
    job_input = "Hiring Python Developer with Docker experience."

    result = get_tailored_results(cv_input, job_input)

    assert isinstance(result, CVTailorResponse)
    assert result.status in ["success", "failure"]
    assert 0 <= result.match_score <= 100
    assert isinstance(result.tailored_cv, str)
    assert isinstance(result.recommendations, list)
